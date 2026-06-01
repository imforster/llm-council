"""LLM client supporting OpenAI-compatible APIs and AWS Bedrock."""

import asyncio
import httpx
from typing import List, Dict, Any, Optional
from .config import LLM_API_KEY, LLM_BASE_URL, AWS_REGION, AWS_BEARER_TOKEN_BEDROCK


def _is_bedrock(model: str) -> bool:
    return model.startswith("bedrock/")


def _bedrock_model_id(model: str) -> str:
    return model.removeprefix("bedrock/")


async def _query_openai_compatible(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"model": model, "messages": messages}

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(
            f"{LLM_BASE_URL}/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        message = data['choices'][0]['message']
        return {
            'content': message.get('content'),
            'reasoning_details': message.get('reasoning_details')
        }


async def _query_bedrock(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0,
    api_key: str = None
) -> Optional[Dict[str, Any]]:
    model_id = _bedrock_model_id(model)
    bedrock_messages = [
        {"role": m["role"], "content": [{"text": m["content"]}]}
        for m in messages
    ]

    token = api_key or AWS_BEARER_TOKEN_BEDROCK
    if token:
        # Bearer token auth via REST API
        url = f"https://bedrock-runtime.{AWS_REGION}.amazonaws.com/model/{model_id}/converse"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        payload = {"messages": bedrock_messages}

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            output = data["output"]["message"]["content"][0]["text"]
            return {"content": output, "reasoning_details": None}
    else:
        # Fall back to boto3 with IAM credentials
        import boto3

        def _invoke():
            client = boto3.client("bedrock-runtime", region_name=AWS_REGION)
            response = client.converse(modelId=model_id, messages=bedrock_messages)
            output = response["output"]["message"]["content"][0]["text"]
            return {"content": output, "reasoning_details": None}

        return await asyncio.to_thread(_invoke)


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0,
    api_key: str = None
) -> Optional[Dict[str, Any]]:
    """Query a model via the appropriate provider."""
    try:
        if _is_bedrock(model):
            return await _query_bedrock(model, messages, timeout, api_key)
        return await _query_openai_compatible(model, messages, timeout)
    except Exception as e:
        print(f"Error querying model {model}: {e}")
        return None


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]],
    api_key: str = None
) -> Dict[str, Optional[Dict[str, Any]]]:
    """Query multiple models in parallel."""
    tasks = [query_model(model, messages, api_key=api_key) for model in models]
    responses = await asyncio.gather(*tasks)
    return {model: response for model, response in zip(models, responses)}
