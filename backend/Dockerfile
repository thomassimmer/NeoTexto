# pull official base image
FROM python:3.11

# set work directory
WORKDIR /usr/src/app

# install psycopg2 dependencies
RUN apt update \
    && apt install postgresql gcc python3-dev musl-dev libffi-dev g++ -y

# install dependencies
RUN pip install -U pip setuptools wheel
RUN pip install spacy==3.7.4

# Uncomment the language to you want to work with.
RUN python -m spacy download fr_core_news_lg
RUN python -m spacy download en_core_web_lg
# RUN python -m spacy download ru_core_news_lg
# RUN python -m spacy download de_core_news_lg
# RUN python -m spacy download ja_core_news_lg
# RUN python -m spacy download zh_core_web_lg
# RUN python -m spacy download it_core_news_lg
# RUN python -m spacy download pt_core_news_lg
# RUN python -m spacy download es_core_news_lg

COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .