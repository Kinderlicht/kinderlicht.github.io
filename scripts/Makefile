install:
	python3 -m venv .venv
	.venv/bin/activate && pip install -r requirements.txt

slides: install
	.venv/bin/activate && python generate_jhv_slides.py
