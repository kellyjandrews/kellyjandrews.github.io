---
title: Using Fuel oAuth with the SOAP API
comments: true
---
Security is a major concern for people these days.  With so many business having a breach of some kind, everyone get's up tight around security concerns. And rightfully so - I'm not a fan of changing passwords all the time because a company left my private data hanging out.

At ExactTarget, security has always been a huge area of concern for us, and we go a long way to help our clients keep their data protected. Over the last couple years, much effort in securing the API services has brought out oAuth2 as a new standard for our API calls.  Using this with the SOAP API is fairly straight forward, and removes the need to include user name and passwords in your SOAP packets.

First, you will need to setup a few things to get it running.  Go to https://code.exacttarget.com and create a user, or log in.  Once that is complete, you will need to go to out AppCenter.  Much like Google and others, you create an application, and tie it directly to your ExactTarget account.  This abstracts your user, and will give you a clientID, and clientSecret to use when retrieving your keys.  For a more complete overview of AppCenter visit [this page](https://code.exacttarget.com/getting-started/app-center-overview). For our instance, create a "Server-to-server" application.

Once you have your app created, you will need to do a quick key retrieval of your API key.

{% highlight js %}
curl -X POST -H "Content-Type: application/json" -d '{ "clientId": "YOURID","clientSecret": "YOURSECRET"}' https://auth.exacttargetapis.com/v1/requestToken
{% endhighlight %}

Running this cURL request should return you

{% highlight js %}
{"accessToken":"YOURACCESSTOKEN","expiresIn":3600}
{% endhighlight %}


If not - check your clientID and clientSecret, make sure those are accurate.  

Once you have your Access Token, make note that it does expire in 60 minutes.  Easiest way to work with this is write a function for when the call comes back unauthorized to grab a new token.

In order to use this token in your SOAP calls, you would need the following

{% highlight xml %}
<Header>
    <fueloauth xmlns="http://exacttarget.com">YOURACCESSTOKEN</fueloauth>
</Header>
{% endhighlight %}


I prefer this method as it lends to better security, and allows for a cleaner SOAP packet to be sent.

As you are building out your integrations, I would recommend incorporating this into your flow - super helpful!
