from django.utils.deconstruct import deconstructible
from django.conf import settings
from storages.backends.gcloud import GoogleCloudStorage
    
@deconstructible
class PrivateGCSMediaStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):
        kwargs["bucket_name"] = getattr(settings, "PRIVATE_BUCKET_NAME")
        super(PrivateGCSMediaStorage, self).__init__(*args, **kwargs)