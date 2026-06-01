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

# Available models for selection in the UI
AVAILABLE_MODELS = [
    # Anthropic
    "bedrock/us.anthropic.claude-opus-4-8",
    "bedrock/us.anthropic.claude-opus-4-7",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
    # Amazon
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/us.amazon.nova-lite-v1:0",
    "bedrock/us.amazon.nova-micro-v1:0",
    # Meta
    "bedrock/us.meta.llama4-maverick-17b-instruct-v1:0",
    "bedrock/us.meta.llama4-scout-17b-instruct-v1:0",
    "bedrock/us.meta.llama3-3-70b-instruct-v1:0",
]

# Default council members
COUNCIL_MODELS = [
    "bedrock/us.anthropic.claude-opus-4-8",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/us.meta.llama4-maverick-17b-instruct-v1:0",
]

# Default chairman model
CHAIRMAN_MODEL = "bedrock/us.anthropic.claude-opus-4-7"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
