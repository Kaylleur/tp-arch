FROM debian:bullseye-slim
RUN useradd toto
USER toto:toto
CMD whoami

