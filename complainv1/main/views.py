from django.shortcuts import render

def home(request):
    return render(request, 'main/index.html')
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib import messages

def signup_view(request):
    """Custom signup page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        
        # Validation
        if password != password2:
            messages.error(request, 'Passwords do not match')
            return render(request, 'main/signup.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'main/signup.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'main/signup.html')
        
        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        messages.success(request, 'Account created successfully!')
        return redirect('home')
    
    return render(request, 'main/signup.html')