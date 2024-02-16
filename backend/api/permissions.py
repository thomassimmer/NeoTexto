from rest_framework import permissions

from api.models import CustomUserModel


class TextPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user: CustomUserModel = request.user
        return user.is_authenticated and user.is_active

    def has_object_permission(self, request, view, text):
        user: CustomUserModel = request.user
        if user.is_authenticated and user.is_active:
            if request.method in permissions.SAFE_METHODS:
                return True
            if user.is_superuser or text.creator == user:
                return True
        return False


class UserTranslationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user: CustomUserModel = request.user
        return user.is_authenticated and user.is_active

    def has_object_permission(self, request, view, user_translation):
        user: CustomUserModel = request.user
        if user.is_authenticated and user.is_active:
            if request.method in permissions.SAFE_METHODS:
                return True
            if user.is_superuser or user_translation.user == user:
                return True
        return False


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user: CustomUserModel = request.user
        return user.is_authenticated and user.is_active

    def has_object_permission(self, request, view, user_object):
        user: CustomUserModel = request.user
        if user.is_authenticated and user.is_active:
            if request.method in permissions.SAFE_METHODS:
                return True
            if user.is_superuser or user == user_object:
                return True
        return False
