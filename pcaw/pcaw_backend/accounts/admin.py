from django.contrib import admin
from accounts.models.user_profiles import UserProfile
from accounts.models.classes import Class, Subject, Semester
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from utils.models.utils import FileUpload
from assignments.models.langs import Lang
# Register your models here.
class AssignmentAdmin(admin.ModelAdmin):
    list_filter = ["is_open", "is_deleted",]
    search_fields = ["assignment_code", "title",]
class ClassAdmin(admin.ModelAdmin):
    list_filter = ["is_open", "is_active", "is_deleted",]
    search_fields = ["name", "code",]
class SubmissionAdmin(admin.ModelAdmin):
    list_filter = ["is_deleted",]
class SubjectAdmin(admin.ModelAdmin):
    list_filter = ["is_deleted",]
    search_fields = ["subject_code",]
class LangAdmin(admin.ModelAdmin):
    list_filter = ["is_deleted",]
class SemesterAdmin(admin.ModelAdmin):
    list_filter = ["is_deleted",]
admin.site.register(UserProfile)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(Lang, LangAdmin)
admin.site.register(Class, ClassAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Semester, SemesterAdmin)
admin.site.register(FileUpload)