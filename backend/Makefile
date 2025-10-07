.PHONY: help dev migrate superuser shell test check install clean

help:
	@echo "ERP AI Backend - Available Commands"
	@echo "===================================="
	@echo "make dev        - Start development server on port 8000"
	@echo "make migrate    - Run database migrations"
	@echo "make superuser  - Create a Django superuser"
	@echo "make shell      - Start Django shell"
	@echo "make test       - Run tests"
	@echo "make check      - Run Django system checks"
	@echo "make install    - Install dependencies"
	@echo "make clean      - Clean Python cache files"

dev:
	@echo "Starting Django development server..."
	source venv/bin/activate && python manage.py runserver 8000

migrate:
	@echo "Running database migrations..."
	source venv/bin/activate && python manage.py migrate

superuser:
	@echo "Creating superuser..."
	source venv/bin/activate && python manage.py createsuperuser

shell:
	@echo "Starting Django shell..."
	source venv/bin/activate && python manage.py shell

test:
	@echo "Running tests..."
	source venv/bin/activate && python manage.py test

check:
	@echo "Running system checks..."
	source venv/bin/activate && python manage.py check

install:
	@echo "Installing dependencies..."
	source venv/bin/activate && pip install -r requirements.txt

clean:
	@echo "Cleaning Python cache files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.log" -delete
	@echo "Cache cleaned!"
