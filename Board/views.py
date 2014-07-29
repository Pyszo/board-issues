from django.shortcuts import render
from django.http import HttpResponseRedirect
import urllib2, urllib, json

client_id = # client ID here
client_secret = # client secret here

def index(request):
	if request.session["token"]:
		access_token = request.session["token"]
		return render(request, 'Board/board.html', {'client_id': client_id, "access_token": access_token })
	else:
		return render(request, 'Board/board.html', {'client_id': client_id})

def callback(request):
	session_code = request.GET.get('code','')
	url = 'https://github.com/login/oauth/access_token'
	header = {'Accept': 'application/json'}
	post_data = [('client_id', client_id),('client_secret', client_secret),('code',session_code)]
	data = urllib.urlencode(post_data)

	req = urllib2.Request(url, data, header)
	result = urllib2.urlopen(req)
	data = result.read()
	request.session["token"] = json.loads(data)["access_token"]
	return HttpResponseRedirect('/')
