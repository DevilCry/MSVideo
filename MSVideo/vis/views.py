from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
def test(request):
    title = "Test Template with django"
    return render_to_response('bing_test.html',locals(),context_instance=RequestContext(request))