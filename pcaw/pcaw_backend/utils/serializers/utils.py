from rest_framework import serializers
from utils.models.utils import FileUpload

class FileSerializer(serializers.ModelSerializer):
    """Represents file upload serializer class."""

    class Meta:
        """Contains model & fields used by this serializer."""

        model = FileUpload
        fields = '__all__'
        read_only_fields = ('owner',)