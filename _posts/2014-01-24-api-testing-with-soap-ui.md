---
title: API Testing with SOAP UI
comments: true
---
Quite often at exacttarget, I find myself required to do some API work.  I'll be the first to admit that staring at a SOAP enevelope for longer than a few seconds turns my brain to mush.

What I keep forgetting about, however, is there is a tool that helps you debug the simple stuff, and test out functionality you are trying to get a handle on.  This, couple with PHP logging,  now I can figure out exactly why my scripts aren't working.  Let's take a look.

####Setup

The very first thing you need to do, is download the application. You can find it at their [website](http://www.soapui.org/).  Download for your specific platform, and then run the installer (on my mac, I had to right-click open the installer).  You can use mostly the defaults, and you really only need the SOAP UI tool, so be sure to uncheck other items unless you need them for something else.

Once you have SOAP UI installed, you are good to get going. Go ahead and create a generic project (ctrl-alt-cmd-N for mac). Name your project "exacttarget" and the add the wsdl url `https://webservice.exacttarget.com/etframework.wsdl`. I typically will uncheck the box to create sample calls.  Click ok.

You should see all of the methods available to the SOAP API for exacttarget.

####Getting Authorized
SOAP UI also us to create REST services in our UI as well.  It's really simple to do, and there is one specifically that we require.  First, you will need to have already set up an app in the exacttarget app center.  You can find app center currently at [Code@](https://code.exacttarget.com).  You will need to sign up for an account, then go through the process of connecting your exacttarget account, and selecting permissions (for now select as many as you can). What you want from this process is the `clientId` and `clientSecret`.

Once you have that completed, right click on the project name, and select "New REST Service from URI".  In the dialog, copy and paste the following:

{% highlight html %}
https://auth.exacttargetapis.com/v1/requestToken
{% endhighlight %}

Click ok, and it will set everything up for you, and open a new window. Change the method type to `POST` and make sure the "Media Type" is listed as `application/json`. In the media type window, at the bottom, add this json, replacing the x's with your appropriate information.

{% highlight js %}
{
  "clientId": "xxxxxxxxxx",
  "clientSecret": "xxxxxxxxxx"
}
{% endhighlight %}

After you get that set up, click the play button in the upper left portion of the window, and get your access token.  The token expires after 60 minutes, but you can come back here to update your token.

####Building your SOAP

If you haven't build a SOAP enevelope before, it can be a little tricky at first, but it's just XML, and looks a little like HTML, so you can easily learn the structure with a little help.

The first portion is building the envelope itself.  Let's work with a `describe` method first. Right-click `describe` and select "New Request." It will generate some generic code, you can delete all of that and replace with the following.

{% highlight xml %}
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

   ...

</soapenv:Envelope>
{% endhighlight %}

Running this code will give you a `Bad Request` response. That is expected, since we have a lot more code to add first.  it's important to note the `soapenv` prefix is there to prevent any naming conflicts. This is an XML thing, and it references the information in `http://schemas.xmlsoap.org/soap/envelope`.  You would set up namespaces to avoid naming collisions, and provide syntax reference. The namespace declaration has the following syntax. _xmlns:prefix="URI"_. It's not required specifically, but makes things a little easier to look at.


####Adding the header

Now is when that authorization token is needed. If it's been longer than 60 minutes, go ahead and refresh your token, copy and paste in your SOAP enevelope.  The header goes in between the open and closing `Envelope` tag.  

{% highlight xml %}
 <soapenv:Envelope ...>
    <soapenv:Header>
         <ns1:fueloauth xmlns:ns1="http://exacttarget.com">XXXXXXXXXXXXXXXXXXXXXXXX</ns1:fueloauth>
    </soapenv:Header>
 </soapenv:Envelope>
{% endhighlight %}

####Give the head a body

The body is where the main work for the call is being done. Here you describe in XML everything you are doing.  For our example, let's look at the `describe` on the `subscriber` object.

{% highlight xml %}
 <soapenv:Envelope ...>
    <soapenv:Header>...</soapenv:Header>
    <soapenv:Body>
      <DefinitionRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
           <DescribeRequests>
            <ObjectDefinitionRequest>
                 <ObjectType>Subscriber</ObjectType>
            </ObjectDefinitionRequest>
         </DescribeRequests>
      </DefinitionRequestMsg>
  </soapenv:Body>
 </soapenv:Envelope>
{% endhighlight %}



####Check the Pointer
Exacttarget has a few endpoints for you to be concerned with.  When you login to your account , you should see an indication of s1, s4, or s6.  If you don't see one, it's safe to assume you are on s1.

Why is this important? You need to point your SOAP call to the correct stack, or it won't work.  One of these endpoints are what you most likely should use:
{% highlight html %}
https://webservice.exacttarget.com/Service.asmx
https://webservice.s4.exacttarget.com/Service.asmx
https://webservice.s6.exacttarget.com/Service.asmx
{% endhighlight %}


####Just push play
Now that you have everything set up, hit the play button in the top left corner of the request window.  On the right, you should now see the results that looks something like

{% highlight xml %}
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
       <soap:Header>
          <wsa:Action>DescribeResponse</wsa:Action>
          <wsa:MessageID>urn:uuid:8e1453e9-089d-4e8e-a354-6762ea434213</wsa:MessageID>
          <wsa:RelatesTo>urn:uuid:ce4235b3-5461-46c8-a58e-8cd40b1f8e5e</wsa:RelatesTo>
      <wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To>
          <wsse:Security>
             <wsu:Timestamp wsu:Id="Timestamp-f1b2e2ce-9291-4fb8-8083-df0cf46136d3">
                <wsu:Created>2014-01-23T14:17:19Z</wsu:Created>
                <wsu:Expires>2014-01-23T14:22:19Z</wsu:Expires>
             </wsu:Timestamp>
           </wsse:Security>
       </soap:Header>
       <soap:Body>
          <DefinitionResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
             <ObjectDefinition>
                <ObjectType>Subscriber</ObjectType>
                 <Properties>
                   <PartnerKey xsi:nil="true"/>
                   <ObjectID xsi:nil="true"/>
                   <Name>ID</Name>
                   <DataType>Int32</DataType>
                   <IsUpdatable>true</IsUpdatable>
                   <IsRetrievable>true</IsRetrievable>
                   <IsRequired>true</IsRequired>
                </Properties>
                ....
{% endhighlight %}



####Go forth and test
Now that you have this under your belt, go out and test other objects and methods.  Understanding the SOAP envelopes your code will create really helps develope a solid understanding of how your application will be interacting with the Fuel Platorm and exacttarget.
