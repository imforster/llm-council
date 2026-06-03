"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI-compatible provider config (OpenRouter, OpenAI, etc.)
LLM_API_KEY = os.getenv("LLM_API_KEY", os.getenv("OPENROUTER_API_KEY", ""))
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1")

# AWS Bedrock config
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_BEARER_TOKEN_BEDROCK = os.getenv("AWS_BEARER_TOKEN_BEDROCK", "")

# Available models for selection in the UI
AVAILABLE_MODELS = [
    # Anthropic
    "bedrock/us.anthropic.claude-opus-4-8",
    "bedrock/us.anthropic.claude-opus-4-7",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.anthropic.claude-opus-4-6-20250918-v1:0",
    "bedrock/us.anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/us.anthropic.claude-opus-4-1-20250414-v1:0",
    "bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0",
    "bedrock/us.anthropic.claude-3-5-haiku-20241022-v1:0",
    "bedrock/us.anthropic.claude-3-haiku-20240307-v1:0",
    "bedrock/us.anthropic.claude-3-sonnet-20240229-v1:0",
    # Amazon Nova
    "bedrock/us.amazon.nova-premier-v1:0",
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/us.amazon.nova-lite-v1:0",
    "bedrock/us.amazon.nova-micro-v1:0",
    "bedrock/us.amazon.nova-sonic-v1:0",
    # Amazon Titan
    "bedrock/amazon.titan-image-generator-v1",
    "bedrock/amazon.titan-embed-text-v2:0",
    "bedrock/amazon.titan-embed-image-v1",
    "bedrock/amazon.titan-embed-text-v1",
    # Amazon Rerank
    "bedrock/amazon.rerank-v1:0",
    # GPT OSS
    "bedrock/cohere.gpt-oss-safeguard-120b",
    "bedrock/cohere.gpt-oss-safeguard-20b",
    "bedrock/cohere.gpt-oss-120b",
    "bedrock/cohere.gpt-oss-20b",
    # Google Gemma
    "bedrock/google.gemma-3-12b-it",
    "bedrock/google.gemma-3-27b-pt",
    "bedrock/google.gemma-3-4b-it",
]

# Default council members
COUNCIL_MODELS = [
    "bedrock/us.anthropic.claude-opus-4-8",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/cohere.gpt-oss-120b",
]

# Default chairman model
CHAIRMAN_MODEL = "bedrock/us.anthropic.claude-opus-4-8"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
