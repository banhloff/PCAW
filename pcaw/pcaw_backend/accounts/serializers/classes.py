from django.conf import settings
from rest_framework import serializers
from accounts.models.classes import Class, Subject, Semester 
from accounts.serializers.accounts import UserSerializer, UserRepresentSerializer
from assignments.serializers.langs import LangSerializer

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
        # depth = 1

class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = "__all__"
        # depth = 1
    def update(self, instance, validated_data):
        # MANIPULATE DATA HERE BEFORE INSERTION
        start_date = self.validated_data.get('date_start')
        date_end = self.validated_data.get('date_end')
        if start_date > date_end:
            raise serializers.ValidationError('Start date must be before End Date')
        instance = super().update(instance, validated_data)
        # ADD CODE HERE THAT YOU WANT TO VIEW
        return instance

    def create(self, validated_data):
        date_start = self.validated_data.get('date_start')
        date_end = self.validated_data.get('date_end')
        if date_start > date_end:
            raise serializers.ValidationError('Start date must be before End Date')
        
        return super().create(validated_data)
    
class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = "__all__"
        # depth = 1

class ClassEnrollSerializer(serializers.Serializer):
    enroll_code = serializers.CharField(required=True)

class SubjectRepresentSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True, read_only=True)
    teachers = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = "__all__"

class ClassRepresentSerializer(serializers.ModelSerializer):
    std_count = serializers.IntegerField(
        source='students.count', 
        read_only=True
    )
    students = UserSerializer(many=True, read_only=True)
    instructor = UserSerializer(many=False, read_only=True)
    langs = LangSerializer(many=True, read_only=True)
    semester = SemesterSerializer(many=False, read_only=True)
    subject = SubjectSerializer(many=False, read_only=True)
    class Meta:
        model = Class
        fields = "__all__"

