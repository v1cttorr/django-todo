@echo off
echo Checking if pip is installed...

:: Check if pip is installed
pip --version >nul 2>nul
if %errorlevel% neq 0 (
    echo pip is not installed. Please install pip first.
    exit /b
)

echo pip is installed. Proceeding...

echo Creating virtual environment...
virtualenv env

echo Activating virtual environment...
call env\Scripts\activate

echo Installing required packages...
pip install -r requirements.txt

echo Making database migrations...
python manage.py makemigrations
python manage.py migrate

echo Creating superuser (optional, you can skip email)...
python manage.py createsuperuser

echo Running the server...
python manage.py runserver

pause
