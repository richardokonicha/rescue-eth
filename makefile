# Makefile for Hardhat project with Alchemy

# Variables
NODE_MODULES = node_modules
HARDHAT = $(NODE_MODULES)/.bin/hardhat
ALCHEMY_API_URL = <Your Alchemy API URL>
NETWORK = sepolia # Change to your desired network

# Default target
.PHONY: all
all: install compile deploy

# Install dependencies
.PHONY: install
install:
	npm install

# Compile smart contracts
.PHONY: compile
compile: $(HARDHAT)
	$(HARDHAT) compile

# Deploy smart contracts
.PHONY: deploy
deploy: $(HARDHAT)
	ALCHEMY_API_URL=$(ALCHEMY_API_URL) $(HARDHAT) run scripts/deploy.js --network $(NETWORK)

# Run tests
.PHONY: test
test: $(HARDHAT)
	$(HARDHAT) test

# Clean artifacts
.PHONY: clean
clean:
	rm -rf artifacts cache

# Install Hardhat locally if not already installed
$(HARDHAT):
	npm install --save-dev hardhat

sepolia_deploy:
	@npx hardhat run scripts/deploy.js --network $(NETWORK)

deploySimple:
	@npx hardhat run scripts/deploySimpleContract.ts --network $(NETWORK)

Deploy:
	@npx hardhat run scripts/deploy.ts --network $(NETWORK)
Interact:
	@npx hardhat run scripts/interact.ts --network $(NETWORK)