"""makeperfect_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin
from makeperfect_app import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='index'),
    url(r'^api_details/(?P<song_id>[0-9]+)/$', views.api_details, name='api_details'),
    url(r'^api_list/(?P<list_id>[0-9]+)/$', views.api_list, name='api_list'),
    url(r'^api_all/(?P<list_id>[0-9]+)/$', views.api_all, name='api_all'),
    url(r'^api_all_not_in_list/(?P<list_id>[0-9]+)/$', views.api_all_not_in_list, name='api_all_not_in_list'),
]

# OLD URLS
# url(r'^song/(?P<song_id>[0-9]+)/$', views.details, name='details'),
# url(r'^edit/(?P<song_id>[0-9]+)/$', views.edit, name='edit'),
# url(r'^editlist/(?P<list_id>[0-9]+)/$', views.editlist, name='editlist')