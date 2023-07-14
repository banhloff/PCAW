import os
import environ
from pathlib import Path
from decouple import config
from google.cloud import secretmanager
from google.oauth2 import service_account
import datetime
import io
from urllib.parse import urlparse
from datetime import timedelta
from oauth2_provider import settings as oauth2_settings
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: don't run with debug turned on in production!

env = environ.Env(DEBUG=(bool, False))
env_file = os.path.join(BASE_DIR, '.env')


if os.path.isfile(env_file):
    # read a local .env file
    env.read_env(env_file)
elif os.environ.get('GOOGLE_CLOUD_PROJECT', None):
    # pull .env file from Secret Manager
    project_id = os.environ.get('GOOGLE_CLOUD_PROJECT')

    client = secretmanager.SecretManagerServiceClient()
    settings_name = os.environ.get('SETTINGS_NAME', 'django_settings')
    name = f'projects/{project_id}/secrets/{settings_name}/versions/latest'
    payload = client.access_secret_version(name=name).payload.data.decode('UTF-8')

    env.read_env(io.StringIO(payload))
else:
    raise Exception('No local .env or GOOGLE_CLOUD_PROJECT detected. No secrets found.')
# SECURITY WARNING: keep the secret key used in production secret!
DEBUG = env('DEBUG')
APPENGINE_URL = env('APPENGINE_URL', default=None)
SECRET_KEY = env('SECRET_KEY')
ADMIN_SITE_HEADER = env('ADMIN_SITE_HEADER')
ADMIN_SITE_TITLE = env('ADMIN_SITE_TITLE')
ADMIN_SITE_INDEX_TITLE= env('ADMIN_SITE_INDEX_TITLE')

# Database
# to deploy to gcloud app engine
DATABASES = {"default": env.db()}
# to deploy locally for migration & test with gcloud sql
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'pcaw_db',
#         'USER': 'postgres',
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST'),
#         'PORT': '5432',
#         'OPTIONS': {
#             'sslmode': 'verify-ca', #leave this line intact
#             'sslrootcert': "server-ca.pem",
#             "sslcert": "client-cert.pem",
#             "sslkey": "client-key.pem",
#         }
#     }
# }
# to deploy locally for test with local db
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'pcaw_db',
#         'USER': 'postgres',
#         'PASSWORD': '123456',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }
# Google configuration
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = env('GOOGLE_CLIENT_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = env('GOOGLE_CLIENT_SECRET')
JDOODLE_CLIENT_ID = env('JDOODLE_CLIENT_ID')
JDOODLE_CLIENT_KEY = env('JDOODLE_CLIENT_KEY')
#The mail addresses and password
SENDER_ADDRESS = env('SENDER_ADDRESS')
SENDER_PASS = env('SENDER_PASS')
#apis & links
REGISTER_CONFIRM_LINK = "spartan-grail-383409.et.r.appspot.com/api/accounts/confirm/"


if APPENGINE_URL:
    # ensure a scheme is present in the URL before it's processed.
    if not urlparse(APPENGINE_URL).scheme:
        APPENGINE_URL = f'https://{APPENGINE_URL}'

    ALLOWED_HOSTS = [urlparse(APPENGINE_URL).netloc]
    CSRF_TRUSTED_ORIGINS = [APPENGINE_URL]
    SECURE_SSL_REDIRECT = True
else:
    ALLOWED_HOSTS = ['*']
CORS_ALLOWED_ORIGINS = [
    'http://spartan-grail-383409.et.r.appspot.com',
    'https://spartan-grail-383409.et.r.appspot.com',
    'http://35.241.98.196',
    'http://widen.dev',
    'https://widen.dev',
]
#gcloud settings


# # gcs settings
GS_PROJECT_ID = env('GOOGLE_CLOUD_PROJECT')

# django < 4.2
DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

# django >= 4.2
STORAGES = {"default": "storages.backends.gcloud.GoogleCloudStorage"}

# django < 4.2
STATICFILES_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

# django >= 4.2
STORAGES = {"staticfiles": "storages.backends.gcloud.GoogleCloudStorage"}

GS_BUCKET_NAME = "bucket_pcaw_public"

PRIVATE_BUCKET_NAME = 'bucket_pcaw_private'

GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    env('GOOGLE_APPLICATION_CREDENTIALS')
)
GS_EXPIRATION = datetime.timedelta(minutes=5)
    
GS_BLOB_CHUNK_SIZE = 1024 * 256 * 40



TEMPLATE_DIRS = [BASE_DIR / 'templates/',]


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/


# Application definition
LOCAL_APPS = (
    'accounts',
    'assignments',
    'utils',
    'permissions'
)
GRAPH_MODELS = {
  'app_labels': ["accounts", "assignments", "utils"],
}

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'knox',
    'oauth2_provider',
    'social_django',
    'drf_social_oauth2',
    'django_extensions',
    'storages',
) + LOCAL_APPS

MIDDLEWARE = (
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

)

ROOT_URLCONF = 'pcaw_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': TEMPLATE_DIRS,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'pcaw_backend.wsgi.application'


 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'knox.auth.TokenAuthentication',
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',  # django-oauth-toolkit >= 1.0.0
        'drf_social_oauth2.authentication.SocialAuthentication',
    ),
	'DEFAULT_PERMISSION_CLASSES': [
   		'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 5,
}
REST_KNOX = {
       'TOKEN_TTL': timedelta(hours=3),  # default time 10h
    }
AUTHENTICATION_BACKENDS = (
   # Google OAuth2
    'social_core.backends.google.GoogleOAuth2',

    # drf-social-oauth2
    'drf_social_oauth2.backends.DjangoOAuth2',

    # Django
    'django.contrib.auth.backends.ModelBackend',
)
oauth2_settings.DEFAULTS['ACCESS_TOKEN_EXPIRE_SECONDS'] = 3 * 60 * 60 
# SOCIAL_AUTH_GOOGLE_OAUTH2_WHITELISTED_DOMAINS = ["fe.edu.vn", "fpt.edu.vn",]

# Define SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE to get extra permissions from Google.
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]
#social pipeline
SOCIAL_AUTH_PIPELINE = (

    # Get the information we can about the user and return it in a simple
    # format to create the user instance later. In some cases the details are
    # already part of the auth response from the provider, but sometimes this
    # could hit a provider API.
    'social_core.pipeline.social_auth.social_details',

    # Get the social uid from whichever service we're authing thru. The uid is
    # the unique identifier of the given user in the provider.
    'social_core.pipeline.social_auth.social_uid',

    # Verifies that the current auth process is valid within the current
    # project, this is where emails and domains whitelists are applied (if
    # defined).
    'social_core.pipeline.social_auth.auth_allowed',

    # Checks if the current social-account is already associated in the site.
    'social_core.pipeline.social_auth.social_user',

    # Make up a username for this person, appends a random string at the end if
    # there's any collision.
    'social_core.pipeline.user.get_username',

    # Send a validation email to the user to verify its email address.
    # Disabled by default.
    # 'social_core.pipeline.mail.mail_validation',

    # Associates the current social details with another user account with
    # a similar email address. Disabled by default.
    'social_core.pipeline.social_auth.associate_by_email',

    # Create a user account if we haven't found one yet.
    'social_core.pipeline.user.create_user',

    # Create the record that associates the social account with the user.
    'social_core.pipeline.social_auth.associate_user',

    # Populate the extra_data field in the social record with the values
    # specified by settings (and the default ones like access_token, etc).
    'social_core.pipeline.social_auth.load_extra_data',

    # Update the user record with any changed info from the auth service.
    'social_core.pipeline.user.user_details',
    # custom local pipeline down here, e.g: assign user to permission groups based on email domain
    # read: https://python-social-auth.readthedocs.io/en/latest/pipeline.html#extending-the-pipeline
    # 'pcaw_backend.pipeline.method_name',

    #assign user to permission groups
    'pcaw_backend.pipeline.assign_permission_group',

    #create user_profile associated with user
    'pcaw_backend.pipeline.create_profile',
)
SOCIAL_AUTH_LAST_LOGIN = 'social_auth_last_login_backend'
# Internationalization

LANGUAGE_CODE = 'en-us'

#TIME_ZONE = 'UTC'
TIME_ZONE ='Asia/Ho_Chi_Minh'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_ROOT = "static"
STATIC_URL = "/static/"
STATICFILES_DIRS = []

MEDIA_URL =  '/media/'

MEDIA_ROOT = "media"

# jdoodle settings 
# https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/languages-and-versions-supported-in-api-and-plugins
# {lang_name : file ext}
LANG_EXT = {
    "C":"c", "C-99": "c" ,
    "CPP":"cpp", "C++ 14": "cpp", "C++ 17": "cpp",
    "CLOJURE":"clj","PHP":"php", "SQL": "sql",
    "PASCAL": "pas",
    "CSS":"css",
    "CSHARP":"cs", 
	"GO":"go","HASKELL":"hs","JAVA":"java",
    "JAVASCRIPT":"js",
	"LISP":"scm",
    "OBJECTIVEC":"m","PERL":"pl",
    "PYTHON2":"py", "PYTHON3":"py","RUBY":"rb",
    "R":"r","RUST":"rs","SCALA":"scala",
    "TEXTFILE":"txt",
    # add more as needed    
}
# {lang_name: lang_code}
LANG_CODE_JDOODLE = {
    "C":"c", "C-99": "c99", 
    "CPP":"cpp","C++ 14": "cpp14", "C++ 17": "cpp17", 
    "CLOJURE":"clojure", "PHP":"php", "SQL": "sql",
    "PASCAL": "pascal",
    "CSS":"", # not exist
    "CSHARP":"csharp",
	"GO":"go","HASKELL":"haskell","JAVA":"java",
    "JAVASCRIPT":"", #not exist
	"LISP":"", # not exist
    "OBJECTIVEC":"objc","PERL":"perl",
    "PYTHON2":"python2","PYTHON3":"python3","RUBY":"ruby",
    "R":"r","RUST":"rust","SCALA":"scala",
    "TEXTFILE":"", # not exist
    # add more as needed    
}
# {lang_code : latest supported version's index}
LANG_VERSION_INDEX_JDOODLE = {
    "c": 5, "c99": 4,
    "cpp": 5, "cpp14": 4, "cpp17": 1, 
    "clojure": 0, "php": 4, "sql": 4,
    "pascal": 3,
    # css not supported
    "csharp": 4,
    "go": 4, "haskell": 4, "java": 4, 
    # js not supported
    # lisp not supported
    "objc": 4, "perl": 4,
    "bash": 4,
    "python2": 3, "python3": 4, "ruby": 4, 
    "r": 4, "rust": 4,"scala": 4,
    # txt not supported
    # add more as needed    
}
JDOODLE_PATH = "https://api.jdoodle.com/v1/execute"
LANG_NOT_SUPPORTED = "CSS, JS, LISP, TEXT not supported!"


#mail template
def CONFIRM_MAIL(link):
    return """
        <html>
            <head></head>
            <body>
                <p>This email has just been used to register to PCAW System (widen.dev)! Click the link to confirm your registration!<br>
                """ + link + """
                </p>
        </body>
    </html>"""


def ENROLL_NOTIF_MAIL(student, enroll_class):
    addressing = ("<p>Hey "+ student.first_name + """ """+ student.last_name + "!</p>") \
        if student.first_name.strip() != '' or student.last_name.strip() != '' \
        else ''
    content = \
        "<html> \
            <head></head> \
            <body>" + \
                addressing + \
                "<p>You have been added to class " + enroll_class.name + " on PCAW System!<br>" + \
                "Login to check for assignments! \
                </p> \
            </body> \
        </html>"
    return content

#regex
INPUT_FILENAME_REGEX = r'^input_\d+$'
INPUT_FILENAME_WEIGHED_REGEX = r'^input_\d+_\d+$'
OUTPUT_FILENAME_REGEX = r'^output_\d+$'
PASSWORD_REGEX = r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$'
FUZZY_THRESHOLD = 10
STUDENT_CODE_REGEX = r"^([A-Za-z]+)((?:BE|SE|HE)([0-9]+))$"

#email domain ---> roles
STUDENT_MAIL_DOMAINS = ['fpt.edu.vn',]
TEACHER_MAIL_DOMAINS = ['fe.edu.vn',]

#date time format
DATETIME_FORMAT = '%Y/%m/%d %H:%M:%S'
DATE_FORMAT = '%Y/%m/%d'
#user groups name
GROUP_TEACHER = "GROUP_Teacher"
GROUP_STUDENT = "GROUP_Student"

#file limit
IO_FILE_LIMIT = 20 * 1024 * 1024 #in MB

# submission apis
SUBMISSION_VISIBLE_OUTPUT_COUNT = 2

# submission status
SUBMISSION_STATUS_UNACCEPTED ='Unaccepted'
SUBMISSION_STATUS_ACCEPTED ='Accepted'
SUBMISSION_STATUS_INCORRECT ='Incorrect'
SUBMISSION_STATUS_CORRECT ='Correct'
SUBMISSION_STATUS_NOTCHECKED ='Not Checked'
SUBMISSION_STATUS_OVERDUE = 'Overdue'

CLASS_SIZE = 30