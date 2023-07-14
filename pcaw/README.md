<h1>Reference:</h1>
-django: https://docs.djangoproject.com/en/4.1/howto/windows/<br />
-django + angular: https://www.twilio.com/blog/build-progressive-web-application-django-angular-part-1-backend-api<br>
-setup .env: https://ngangasn.com/how-to-use-env-files-for-local-and-production-django-websites/<br>
-social authen.: <br>
https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting <br>
https://www.youtube.com/watch?v=wlcCvzOLL8w <br>
https://github.com/wagnerdelima/drf-social-oauth2<br>
-deploy django to App Engine: <br>
https://cloud.google.com/python/django/appengine <br>
<br>

<h1>Register jdoodle for client id & secret key:</h1>
-https://www.jdoodle.com/compiler-api/<br />

<h1>Setup oauth2 key/secret in https://console.cloud.google.com/ </h1>
-follow part of this vid https://www.youtube.com/watch?v=wlcCvzOLL8w 
<br>

<h1>Setup .env in project root with keys:</h1>
JDOODLE_CLIENT_ID=<br>
JDOODLE_CLIENT_KEY=<br>
SENDER_ADDRESS=email<br>
SENDER_PASS=email_password<br>
GOOGLE_CLIENT_KEY=<br>
GOOGLE_CLIENT_SECRET=<br>
#DEBUG mode<br>
DEBUG=1<br>
#public bucket name<br>
GS_BUCKET_NAME=<br>
GOOGLE_APPLICATION_CREDENTIALS=gcs_credential.json<br>
GOOGLE_CLOUD_PROJECT=<br>
USE_CLOUD_SQL_AUTH_PROXY=true<br>
# postgres://[db_username]:[db_password]@//cloudsql/[project_id]:[sql_region_id]:[db_instance]/[db_name]<br>
DATABASE_URL=<br>
DB_PASSWORD=<br>
DB_HOST=<br>
# django secret key settings.py<br>
SECRET_KEY=++zep=_d-f+ba)0zz*g3b!hwz)4=nyqzvl_m-)$e6w%bop4jlj<br>
ADMIN_SITE_HEADER=PCAW Admin<br>
ADMIN_SITE_TITLE=PCAW Admin Portal<br>
ADMIN_SITE_INDEX_TITLE=Pratice Coding and Learning Website Admin Portal<br>
<br>

<h1>Follow drf-social-oauth2 github's readme to setup Application in Admin site </h1>
-note: save client_id & client_secret before saving since client_secret will be hashed<br> 
<br />
<h1>Migrate DB if needed:</h1>
*Use 2nd DATABASE config in settings if gcloud deployed, use 3rd config in settings if DB is locally deployed<br />
-<code>py manage.py makemigrations </code> (make migration based on project's models change)<br />
-<code>py manage.py migrate </code> (make change to db)<br />
<br />
<h1>Create Superuser if needed: </h1>
-<code>py manage.py createsuperuser</code> (create superuser, just go for name: 'admin', password: 'password!')<br />
<h1>Deploying:</h1>
-Use 1st DATABASE config in settings if deploying app & db to AppEngine, Cloud SQL & Cloud Storage <br>
-Use 2nd config inn settings if deploying app locally but db remains on Cloud SQL & Cloud Storage <br>
-Use 3rd config in settings if deploying app & db locally <br>
-Remove STORAGE configs in settings to save files in project locally instead of Cloud Storage<br>
<h1>admin site: [host]/admin</h1>
e.g: localhost:8000/admin <br>
<br>

<h1>Setup Groups & associated permissions in admin site: </h1>
ref: <code>permissions.permissions</code>
-name: 'GROUP_Teacher' -perms: can CRUD most things, Submissions, Assignments, Classes,...<br>
-name: 'GROUP_Student' -perms: can CRUD submissions, View assignments, subjects, classes, semesters, View/Update user_profile<br>
-<code>pcaw_backend.pipeline, utils.utils, permissions.permissions</code>
 will need these for authorization<br>

<h1>For apis requiring authentication, add Authorization to Request Header</h1>
(for now, all apis need Authentication, except login, register & confirm register)<br>
-for user logged in with Google:<br>
Key: Authorization - Value: Bearer (access_token_given) -- without () <br>
-for user logged in with user/password:<Br>
Key: Authorization - Value: Token (knox_token_from_login) -- without () <br>

<h1>APIs:</h1>
*note:<br> 
APIs use Serializers to Represent/(de)serialize data<br>
-<code>[ModelName]RepresentSerializer</code>: Serializers for List/Retrieve (representation). Nested objects/data serialized with <code>depth = x</code>. e.g: <code>UserRepresentSerializer, ClassRepresentSerializer,...</code> <br>
-<code>[ModelName]Serializer</code>: Serializers for Update/Partial-Update. Nested objects/data serialized by <code>id</code>. e.g: <code>UserSerializer, ClassSerializer,...</code> <br>
ref: https://stackoverflow.com/questions/67696463/partial-updating-a-manytomany-field-but-keeping-its-get-representation<br>
<br>
<h2>APIs specs: </h2>
-http://localhost:8000/api/assignments/ (ALL)<br> 
*http://localhost:8000/api/assignments/(id) (GET) - retrieve<br>
*http://localhost:8000/api/assignments/ (GET) - list <br>
*http://localhost:8000/api/assignments/ (POST) - create <br>
ref: <code>assignments.serializers.assignments.AssignmentSerializer</code><br>
io_file: ext <code>.zip</code>, io files: <code>input_x.txt, output_x.txt</code> x = int <br>
*http://localhost:8000/api/assignments/(id) (PUT) - update <br>
ref: <code>assignments.serializers.assignments.AssignmentSerializer</code><br>
*http://localhost:8000/api/assignments/(id) (PATCH) - update partial <br>
ref: <code>assignments.serializers.assignments.AssignmentSerializer</code><br>
*http://localhost:8000/api/assignments/(id) (DELETE) - destroy <br>
*http://localhost:8000/api/assignments/yours (GET) - list user's enrolled class' assignments
<br>
*http://localhost:8000/api/assignments/(id)/submissions (GET) - list submissions by assignment id<br>
<br>
-http://localhost:8000/api/submisisons/ (ALL)<br>
*http://localhost:8000/api/submisisons/ (POST) - create <br>
ref: <code>assignments.serializers.submissions.SubmissionPostSerializer, pcaw_backend.settings</code><br>
ref: https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/languages-and-versions-supported-in-api-and-plugins<br>
*lang = language code in jdoodle<br>
*lang can be derived from file extension on FE, <br>
e.g: <code>main.java</code> --> <code>java</code>,<code>main.cpp</code> --> <code>cpp17</code>
<br>
*http://localhost:8000/api/submisisons/(id) (PUT/PATCH) - update/partial-update <br>
ref: <code>assignments.serializers.submissions.SubmissionSerializer</code><br>
*http://localhost:8000/api/submissions/(submission_id)/checker/ (GET) - check plagiarism<br>
<br>  
-http://localhost:8000/api/accounts/ (ALL)<br>
*http://localhost:8000/api/accounts/ (GET) - list both Teachers & Students <br>
*http://localhost:8000/api/accounts/(user_id) (GET) - get user by id <br>
ref: <code>accounts.serializers.accounts.UserRepresentSerializer</code><br>
*http://localhost:8000/api/accounts/(user_id)/roles (GET) - get user's roles <br>
ref: <code>accounts.serializers.accounts.GroupSerializer</code><br>
*http://localhost:8000/api/accounts/(user_id) (PUT/PATCH) - update (both student & teacher) <br>
ref: <code>accounts.serializers.accounts.UserSerializer</code><br>
*http://localhost:8000/api/accounts/teachers (GET) - list Teachers <br>
*http://localhost:8000/api/accounts/students (GET) - list Students <br>
<br>
-http://localhost:8000/api/accounts/login/ (POST) - username/password login<br>
ref: <code>accounts.serializers.accounts.KnoxLoginUserSerializer</code> <br>
-http://localhost:8000/api/accounts/user/ (GET) - get current logged in user <br>
-http://localhost:8000/api/accounts/register/ (POST) - username/password register<br> 
ref: <code>accounts.serializers.accounts.RegisterSerializer</code><br>
-http://localhost:8000/api/accounts/change-password/ (POST) - change password<br>
ref: <code>accounts.serializers.accounts.ChangePasswordSerializer</code><br>
-http://localhost:8000/api/accounts/confirm/(uidb64(userid))/(register_confirm_token)/ (GET) <br>
-http://localhost:8000/api/accounts/logout/ (POST)<br>
-http://localhost:8000/api/accounts/logoutall/ (POST)<br>
<br>
-http://localhost:8000/api/classes/ (ALL)<br> 
ref: <code>accounts.serializers.classes.ClassSerializer</code> <br>
*http://localhost:8000/api/classes/(class_id)/import (POST) - import Student list into Class <br>
ref: <code>utils.serializers.utils.FileSerializer</code><br>
file columns: (first_name, last_name, email)<br>
*http://localhost:8000/api/classes/(class_id)/enroll (POST) - enroll into Class <br>
ref: <code>accounts.serializers.classes.ClassEnrollSerializer</code> <br>
*http://localhost:8000/api/classes/(class_id)/unenroll (POST) - unenroll from Class <br>
*http://localhost:8000/api/classes/(class_id)/students (GET) - get Class's student list <br>
ref: <code>accounts.serializers.classes.ClassSerializer, accounts.serializers.accounts.UserRepresentSerializer</code> <br>
*http://localhost:8000/api/classes/yours (GET) - show teacher/student own classes <br> 
*http://localhost:8000/api/classes/(id)/assignments/ (GET) - show class' assignments <br>
<br> 
-http://localhost:8000/api/subjects/ (ALL)<br> 
ref: <code>accounts.serializers.classes.SubjectSerializer</code><br>
<br>
-http://localhost:8000/api/semesters/ (ALL)<br>
ref: <code>accounts.serializers.classes.SemesterSerializer</code> <br>
<br>
-http://localhost:8000/auth-social/token (POST) - social auth, see drf-social-auth2 <br>
-http://localhost:8000/auth-social/convert-token (POST) - '' <br>
-http://localhost:8000/auth-social/revoke-token (POST) - '' <br>
-http://localhost:8000/auth-social/invalidate-sessions (POST) - '' <br>
.....<br>
<br>
<h1>Social login example:</h1>
FrontEnd: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting <br>
1. go to: https://developers.google.com/oauthplayground/<br>
1.1. add https://www.googleapis.com/auth/userinfo.profile, https://www.googleapis.com/auth/userinfo.email to scope <br>
1.2. Authorize APIs<br>
2. on Step 2, [Exchange authorization code...] <br>
2.1. copy Access_token <br>
BackEnd:<br>
3. In POSTMAN, call http://localhost:8000/auth-social/convert-token (POST) <br>
3.1. Request Body: <br>
<code>{<br>
    "backend":"google-oauth2", <br>
    "token":"google access token given",<br>
    "client_secret":"(client_secret obtained from [Applications] in localhost:8000/admin)",<br>
    "client_id":"(client_id otained from [Applications] in localhost:8000/admin)",<br>
    "grant_type":"convert_token"<br>
}</code><br>
4. Use Access_token gotten as Header for other requests<br>
4.1. Example: submit code solution for an Assignment: http://localhost:8000/api/submisisons/ (POST) <br>
*create needed data for assignment in Admin site, including input output zip file <br>
4.2: Header: Key: Authorization - Value: Bearer (access_token_given) -- without () <br>
4.3. Body: <br>
<code>{<br>
    "lang":"python2",<br>
    "content":"print(int(input(' ')) + int(input(' ')))",<br>
    "assignment": "(assignment code)"<br>
}</code><br>
5. To logout user: call http://localhost:8000/auth-social/invalidate-sessions (POST) <br>
5.1. Request Body: <br>
<code>{<br>
    "client_id":"(client_id otained from [Applications] in localhost:8000/admin)"<br>
}</code><br>

<h1>Testing</h1>
ref: https://docs.djangoproject.com/en/4.1/topics/testing/overview/ <br>
-<code>pip install coverage</code>
run all tests: <br>
<code>coverage run --source='.' manage.py test --pattern="test_*.py"</code><br>

test coverage: <br>
<code>coverage html</code><br>
report location: htmlcov/index.html<br>

<h1>Generate Class Diagram</h1>
-install graphviz: https://graphviz.org/download/<br>
-add graphviz path <code>......\Graphviz\bin, ......\Graphviz\bin\dot.exe</code><br>
-<code>pip install graphviz pydot django-extensions</code><br>
-<code>python manage.py graph_models --pydot -a -g -o pcaw_Class_Diagram.png</code><br>
-ref: https://django-extensions.readthedocs.io/en/latest/graph_models.html <br>
