"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI-compatible provider config (OpenRouter, OpenAI, etc.)
LLM_API_KEY = os.getenv("LLM_API_KEY", os.getenv("OPENROUTER_API_KEY", ""))
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1")

# AWS Bedrock config
AWS_REGION = os.getenv("AWS_REGION", "us-west-2")
AWS_BEARER_TOKEN_BEDROCK = os.getenv("AWS_BEARER_TOKEN_BEDROCK", "")

# Council members - prefix with "bedrock/" to use Bedrock, otherwise OpenAI-compatible
COUNCIL_MODELS = [
    "bedrock/us.anthropic.claude-opus-4-8",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/us.meta.llama4-maverick-17b-instruct-v1:0",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "bedrock/us.anthropic.claude-opus-4-7"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
