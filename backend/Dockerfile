FROM python:3.8.12-buster

WORKDIR /backend

COPY . /backend
RUN pip install --no-cache-dir -r /backend/requirements.txt

RUN chmod +x ./wait-for-it.sh ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]