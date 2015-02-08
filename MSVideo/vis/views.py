from django.shortcuts import render_to_response
from django.template import RequestContext
import json
from django.http import HttpResponse
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

def getData(request):
    f = open('G:/Project/MSVideo/MSVideo/MSVideo/static/testData2.json','r')
    result = json.load(f)
    to_return = {'result':'success'}
    print(request.method)
    if request.method == 'GET':
        to_return['data'] = result
    else:
        to_return['result'] ='fail'
    # print to_return
    return HttpResponse(json.dumps(to_return), content_type='application/json')

def tree(request):

    return render_to_response('tree_test.html',locals(),context_instance=RequestContext(request))

def sunburst(request):

    return render_to_response("sunburst.html", locals(), context_instance=RequestContext(request))