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
from django.conf import settings
# from makeperfect_app import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api_association/(?P<list_item_id>[0-9]+)/$', "makeperfect_app.views.api_association", name='api_association'),
    # url(r'^$', views.index, name='index'),
    url(r'^api_details/(?P<song_id>[0-9]+)/$', "makeperfect_app.views.api_details", name='api_details'),
    url(r'^api_list/(?P<list_id>[0-9]+)/$', "makeperfect_app.views.api_list", name='api_list'),
    url(r'^api_all_songs/$', "makeperfect_app.views.api_all_songs", name='api_all_songs'),
    url(r'^api_all_lists/$', "makeperfect_app.views.api_all_lists", name='api_all_lists'),
    url(r'^api_all_not_in_list/(?P<list_id>[0-9]+)/$', "makeperfect_app.views.api_all_not_in_list", name='api_all_not_in_list'),
    url(r'^login/$', "makeperfect_app.views.login_view", name="login"),
    # url(r'^login/$', 'views.login_view'),
    url(r'^register/$', 'makeperfect_app.views.register_view'),
]


# If index.html or nothing (/), then serve static html into url
###############################################################

if settings.DEBUG:
    urlpatterns += patterns(
        'django.contrib.staticfiles.views',
        url(r'^(?:index.html)?$', 'serve', kwargs={'path': 'html/index.html'}),
        url(r'^(?:login.html)?$', 'serve', kwargs={'path': 'html/login.html'}),
        url(r'^(?:register.html)?$', 'serve', kwargs={'path': 'html/register.html'}),
        url(r'^(?P<path>(?:js|css|img)/.*)$', 'serve'),
    )


# OLD URLS
# url(r'^song/(?P<song_id>[0-9]+)/$', views.details, name='details'),
# url(r'^edit/(?P<song_id>[0-9]+)/$', views.edit, name='edit'),
# url(r'^editlist/(?P<list_id>[0-9]+)/$', views.editlist, name='editlist')