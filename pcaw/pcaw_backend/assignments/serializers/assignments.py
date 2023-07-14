from rest_framework import serializers
from django.contrib.auth.models import User
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from django.contrib.auth import authenticate
from accounts.serializers.accounts import UserSerializer 
from accounts.serializers.classes import ClassSerializer
from utils.validators import validate_io_file
from assignments.serializers.langs import LangSerializer
from django.utils import timezone
import datetime
class AssignmentSerializer(serializers.ModelSerializer):
    io_file = serializers.FileField(required=False, validators=[validate_io_file])
    class Meta:
        model = Assignment
        fields = '__all__'
        # depth = 1
    def update(self, instance, validated_data):
        # MANIPULATE DATA HERE BEFORE INSERTION
        start_date = self.validated_data.get('start_date', None)
        due_date = self.validated_data.get('due_date', None)
        if start_date is not None and due_date is not None:
            if start_date > due_date:
                raise serializers.ValidationError('Start date must be before Due Date')
        instance = super().update(instance, validated_data)
        # ADD CODE HERE THAT YOU WANT TO VIEW
        return instance

    def create(self, validated_data):
        start_date = self.validated_data.get('start_date')
        due_date = self.validated_data.get('due_date')
        if start_date > due_date:
            raise serializers.ValidationError('Start date must be before Due Date')
        #obj = Assignment.objects.create(**validated_data)
        #obj.save()
        #return obj
        return super().create(validated_data)

    
class AssignmentRepresentSerializer(serializers.ModelSerializer):
    in_class = ClassSerializer(many=False, read_only=True)
    langs = LangSerializer(many=True, read_only=True)
    sub_count = serializers.IntegerField(source='get_submission_count', read_only=True)
    std_count = serializers.IntegerField(
        source='in_class.students.count', 
        read_only=True
    )
    class Meta:
        model = Assignment
        fields = '__all__'
        depth = 1

    