---
title: Fuel SDK Awesomeness
comments: true
---
#### The 800-lb Gorilla
Building on top of ExactTarget has long since been something developers would have great difficulty with.  SOAP APIs are something not everyone jumps up and down for, with great excitement.

It's just not sexy - it's not the newesst, hottest thing. However, there is something with the FuelAPIs that most new, hot APIs don't have - the power to do something behind it. The ability to scale to over 1 billion emails in a day is not something too many others can say.  Now that - _is_ hot.

So how do you take 2 types of integration, SOAP and REST, each with distinct paths and nuance, and make it easier?  An SDK.

#### The Easy Button
The FuelSDK has made my life of development night and day.  I can begin creating SOAP or REST calls in a very short time frame, without setting up two types of authentication, and with out having to look up which API does what. Time to live is always a concern, and the FuelSDK

It's hard to directly explain how much impact it has, but showing code is one way visually. Take the following example to create a new data extensions with the fields Email, First Name, and Last Name.

#### The Old Way

```php
<?php
  require(`'exacttarget_soap_client.php`');
    $wsdl = 'https://webservice.exacttarget.com/etframework.wsdl'';
    try {
  // Create the Soap Client
      $client = new ExactTargetSoapClient($wsdl, array('trace'=>1));
        // Set username and password here
        $client->username = 'XXXXX';
        $client->password = 'XXXXX';
    $newde = new ExactTarget_DataExtension();
        $newde->Name = "New DE";
        $newde->CustomerKey = "New DE";
        $newde->IsSendable = true;
        $newde->IsTestable = false;
        $newde->SendableDataExtensionField = new ExactTarget_DataExtensionField();
        $newde->SendableDataExtensionField->Name = 'EMAIL';
        $newde->SendableSubscriberField = new ExactTarget_Attribute();
        $newde->SendableSubscriberField->Name = 'Email Address';
    $newde->Fields = array();
    $emailfield = new ExactTarget_DataExtensionField();
        $emailfield->Name = 'EMAIL';
        $emailfield->IsPrimaryKey = true;
        $emailfield->IsRequired = true;
        $emailfield->FieldType = ExactTarget_DataExtensionFieldType::EmailAddress;
        $newde->Fields[] = $emailfield;
        $fnamefield = new ExactTarget_DataExtensionField();
        $fnamefield->Name = 'First Name';
        $fnamefield->IsPrimaryKey = false;
        $fnamefield->FieldType = ExactTarget_DataExtensionFieldType::Text;
        $newde->Fields[] = $fnamefield;
        $lnamefield = new ExactTarget_DataExtensionField();
        $lnamefield->Name = 'Last Name';
        $lnamefield->IsPrimaryKey = false;
        $lnamefield->FieldType = ExactTarget_DataExtensionFieldType::Text;
        $newde->Fields[] = $lnamefield;
        $object = new SoapVar($newde, SOAP_ENC_OBJECT, 'DataExtension', "http://exacttarget.com/wsdl/partnerAPI");
        $request = new ExactTarget_CreateRequest();
        $request->Options = NULL;
        $request->Objects = array($object);
    $results = $client->Create($request);
        var_dump($results);
} catch (Exception  $e) {
  var_dump($e);
}
?>
```

#### The New Way
```php
<?php
  require('../ET_Client.php');
    try {
      $myclient = new ET_Client();
    $newde = new ET_DataExtension();
        $newde->authStub = $myclient;
        $newde->props = array("Name" => "New DE", "CustomerKey" => "New DE");
        $postDE->columns = array();
        $postDE->columns[] = array("Name" => "Email", "FieldType" => "EmailAddress", "IsPrimaryKey" => "true","MaxLength" => "100", "IsRequired" => "true");
        $postDE->columns[] = array("Name" => "First Name", "FieldType" => "Text");
        $postDE->columns[] = array("Name" => "Last Name", "FieldType" => "Text");
        $postResult = $postDE->post();
        print_r($postResult->results);
 } catch (Exception  $e) {
  var_dump($e);
}
```

If you ask anyone, that should pretty much be self explanatory.

The PHP Version is on GitHub -> https://github.com/ExactTarget/FuelSDK-PHP

There is also one for [Ruby](https://github.com/ExactTarget/FuelSDK-Ruby), [Python](https://github.com/ExactTarget/FuelSDK-Python), [C#](https://github.com/ExactTarget/FuelSDK-CSharp) and [Java](https://github.com/ExactTarget/FuelSDK-Java).
