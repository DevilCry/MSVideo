from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
def test(request):
    title = "Test Template with django"
    lists=[]
    for i in range(0,2,1):
        item={}
        item['title'] = i.__str__()
        item['path'] = 'images/'+i.__str__()+'.png'
        lists.append(item)
    return render_to_response('bing_test.html',locals(),context_instance=RequestContext(request))