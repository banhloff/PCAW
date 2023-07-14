from rest_framework import serializers
from django.contrib.auth import authenticate
from assignments.models.langs import Lang
class LangSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lang
        fields = '__all__'
        # depth = 1

class LangRepresentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lang
        fields = '__all__'
        depth = 1