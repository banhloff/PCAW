from rest_framework import serializers
from django.contrib.auth.models import User
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from django.contrib.auth import authenticate
from accounts.serializers.accounts import UserSerializer
from assignments.serializers.assignments import AssignmentSerializer

class SubmissionSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(min_value=0.0, max_value=10.0)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Submission
        fields = '__all__'
        # depth = 1

class SubmissionRepresentSerializer(serializers.ModelSerializer):
    highest_ratio = serializers.FloatField(source='get_highest_ratio')
    user = UserSerializer(read_only=True)
    class Meta:
        model = Submission
        fields = '__all__'
        depth = 1

# update() or create() have to be implemented in Serializer, ModelSerializer implements both by default 
# save() calls update() or save() depends on if instance is passed when initiating
# implement both update() & create() or override save()
# https://github.com/encode/django-rest-framework/blob/master/rest_framework/serializers.py

class SubmissionPostSerializer(serializers.Serializer):
    assignment = serializers.CharField(required=True)
    in_class = serializers.CharField(required=True)
    content = serializers.CharField(required=True)
    lang = serializers.CharField(required=True)
    file_name = serializers.CharField(required=False)
    def save(self):
        assignment_code=self.validated_data.get('assignment')
        in_class=self.validated_data.get('in_class')
        user=self.context['request'].user
        assignment=Assignment.objects.get(assignment_code=assignment_code, in_class__code=in_class)
        content = self.validated_data.get('content')
        lang=self.validated_data.get('lang')
        #if exist, replace
        if(Submission.objects.filter(user=user, assignment=assignment).count()> 0):
            submission = Submission.objects.get(user=user, assignment=assignment)
            submission.content = content
            submission.lang= lang
            submission.save()
            return submission
        #otherwise, create
        submission = Submission.objects.create(
            user=user, 
            #user=User.objects.get(pk=2), for testing
            content=content,
            lang=lang,
            assignment=assignment,
            is_deleted=False,
            status='-')
        submission.save()
        return submission


