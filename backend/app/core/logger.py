import logging
import sys

# Configure structured enterprise logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Create a module-level logger specifically for TruthLens
logger = logging.getLogger("TruthLens")
