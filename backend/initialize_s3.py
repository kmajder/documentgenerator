from extensions import s3_client
from config import Config
from flask import current_app as app
import botocore

def initialize_s3_bucket():
    bucket_name = Config.S3_TEMPLATES_BUCKET_NAME
    region = Config.S3_REGION

    try:
        s3_client.head_bucket(Bucket=bucket_name)
        app.logger.info(f"Bucket {bucket_name} już istnieje")
    except botocore.exceptions.ClientError as e:
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            # Bucket nie istnieje — tworzymy
            try:
                s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': region}
                )
                app.logger.info(f"Bucket {bucket_name} utworzony")
            except Exception as ex:
                app.logger.error(f"Błąd tworzenia bucketu {bucket_name}: {ex}")
                raise
        else:
            app.logger.error(f"Błąd sprawdzania bucketu: {e}")
            raise
