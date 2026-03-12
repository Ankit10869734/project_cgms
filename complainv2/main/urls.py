from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # This shows landing OR dashboard based on login
    path('signup/', views.signup_view, name='signup'), 
    path('dashboard/', views.dashboard, name='dashboard'),
]