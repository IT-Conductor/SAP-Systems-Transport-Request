var TRUE       = "true";
var FALSE      = "false";
var UNDEFINED  = "undefined";

var ABSOLUTE   = "absolute";
var FIXED      = "fixed";
var STATIC     = "static";
var RELATIVE   = "relative";

var READY_STATE_UNINITIALIZED = 0;
var READY_STATE_LOADING       = 1;
var READY_STATE_LOADED        = 2;
var READY_STATE_INTERACTIVE   = 3;
var READY_STATE_COMPLETE      = 4;

var HTTP_METHOD_GET  = "GET";
var HTTP_METHOD_POST = "POST";

var HEADER_X_REQUESTED_BY       = "X-Requested-By";
var HEADER_CONTENT_TYPE         = "Content-Type";
var HEADER_CONTENT_LENGTH       = "Content-Length";
var HEADER_CONTENT_DISPOSITION  = "Content-Disposition";
var HEADER_CACHE_CONTROL        = "Cache-Control";
var HEADER_LOCATION             = "Location";

var HEADER_PRAGMA = "Pragma";

var REQUESTED_BY_ITCONDUCTOR    = "itconductor-gui";

var CONTENT_TYPE_FORM_URLENCODED = "application/x-www-form-urlencoded";
var CONTENT_TYPE_FORM_MULTIPART  = "multipart/form-data";

var CACHE_CONTROL_NO_STORE = "no-store, max-age=0";
var PRAGMA_NO_CACHE        = "no-cache";

var NODE_CLASS_POPUP                 = "popup";
var NODE_CLASS_POPUP_WINDOW          = "popup-window";
var NODE_CLASS_POPUP_DECORATION      = "popup-decoration";
var NODE_CLASS_POPUP_TITLE           = "popup-title";
var NODE_CLASS_POPUP_CONTROL         = "popup-ctrl";
var NODE_CLASS_POPUP_BODY            = "popup-body";
var NODE_CLASS_POPUP_BUTTONS         = "popup-buttons";
var NODE_CLASS_POPUP_RESIZE          = "popup-resize";

var NODE_CLASS_CONTROL_EXPAND        = "control-expand";
var NODE_CLASS_CONTROL_COLLAPSE      = "control-collapse";
var NODE_CLASS_CONTROL_CLOSE         = "control-close";
var NODE_CLASS_CONTROL_RELOAD        = "control-reload";

var BLOCK      = "block";
var INLINE     = "inline";
var INLINE_BLOCK= "inline-block";
var VISIBLE    = "visible";
var HIDDEN     = "hidden";
var NONE       = "none";
var MOVE       = "move";
var RESIZE_ALL = "nwse-resize";
var RESIZE_LR  = "e-resize";
var AUTO       = "auto";
var NONE_VALUE = "NONE";
var PX         = "px";
var IMPORTANT  = " !important";

var SPINNER = "spinner";

var CHANGE_REQUEST_CLASS="SAPTransportChangeRequest";

var UID="UniqueID";
var COMMENTS="Comments";
var SOURCE_SID="SourceSID";
var TARGET_SID_PFX="TargetSID.";
var TARGET_LBL_PFX="TargetSIDLabel.";
var TARGET_CHK_PFX="TargetSID.CheckBox.";
var TARGET_SIDS="TargetSIDs";

var REQUESTOR="Requestor";

var REQUEST_CUSTOM="SAPTransportChangeRequest.CustomTransports";
var REQUEST_WORKB="SAPTransportChangeRequest.WorkbenchTransports";

var REQUEST_CUSTOM_ID="CustomTransports";
var REQUEST_WORKB_ID="WorkbenchTransports";

var REQUEST_TABLE="RequestTable";


var SECTION_CUSTOM="Custom";
var SECTION_WRKBNCH="Workbench";

var SYSTEMS = {
  "ZO1": ["ZO2", "ZO3"],
};
/**
 * 
 * @param obj
 * @returns
 */
function isDefined (obj)
{
  return (typeof obj != UNDEFINED);
}
/**
 * 
 * @returns
 */
function UUID()
{
  var seed = Date.now();
  if (window.performance && typeof window.performance.now === "function") {
    seed += performance.now();
  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed/16);
    return (c === 'x' ? r : r & (0x3|0x8)).toString(16);
  });
  return uuid;
}
/**
 * 
 * @returns
 */
function return_false ()
{
  return false;
}

/***************************************************
 *  AJAX Class
 ***************************************************/

function AJAXContainer (oid,
                        url,
                        popupName,
                        popupLeft,
                        popupTop,
                        renderer,
                        closeable,
                        method,
                        content)
{
  if (url)
  {
     this._url = url;
  }
  if (!popupName)
  {
    popupName = "";
  }
  this._oid             = oid;
  this._popupName       = popupName;
  this._popupLeft       = popupLeft;
  this._popupTop        = popupTop;
  this._renderer        = renderer;
  this._close           = isDefined (closeable) ? closeable : true;
  this._method          = method ? method.toUpperCase() : HTTP_METHOD_POST;
  this._content         = content;
  this.load();
}

AJAXContainer.prototype._url         = null;
AJAXContainer.prototype._content     = null;
AJAXContainer.prototype._request     = null;
AJAXContainer.prototype._popupName   = null;
AJAXContainer.prototype._popupLeft   = null;
AJAXContainer.prototype._popupTop    = null;
AJAXContainer.prototype._renderer    = null;
AJAXContainer.prototype._oid         = null;
AJAXContainer.prototype._close       = null;
AJAXContainer._content               = null;

/**
 * Create XMLHttpRequest
 */
AJAXContainer.prototype.getXMLHTTPRequest = function()
{
  var xRequest=null;
  if (isDefined (XMLHttpRequest))
  {
    xRequest=new XMLHttpRequest();
  }
  else if (isDefined (ActiveXObject))
  {
   try
   {
     xRequest = new ActiveXObject("Msxml2.XMLHTTP");
   }
   catch (e)
   {
     try
     {
       xRequest = new ActiveXObject ("Microsoft.XMLHTTP");
     }
     catch (E)
     {
       xRequest = false;
     }
   }
  }
  return xRequest;
};
/**
*  Tells the class to load its data and render the results.
*/
AJAXContainer.prototype.load = function()
{
  //callback will be an anonymous function that calls back into our class
  //this allows the call back in which we handle the response (_onData())
  // to have the correct scope.
  this._request = this.getXMLHTTPRequest();
  //set the var so we can scope the callback
  var _this = this;
  var url   = this._url;

  if (this._request)
  {
    this._request.onreadystatechange = function(){_this._onReady();};

    var headers = new Array();
    // CSRF protection
    headers[HEADER_X_REQUESTED_BY]= REQUESTED_BY_ITCONDUCTOR;

    if (this._method == HTTP_METHOD_POST)
    {
      var content = this._content;

      var contentType = null;
      if (!content)
      {
        contentType = CONTENT_TYPE_FORM_URLENCODED+"; charset="+document.characterSet;

        headers [HEADER_CONTENT_TYPE] = contentType;

        var index      = url.indexOf("?");
        if (index > 0)
        {
           url     = this._url.substring (0, index);
           content = this._url.substring (index+1).replace(/\%uFEFF/gi, "");
        }
        else
        {
            url = urlOnly;
            content = "";
        }
      }

      this._request.open (this._method, url, true);
      /*
      if (typeof this._request.setRequestHeader == UNDEFINED)
      {
        if (typeof this._request.setContentType != UNDEFINED)
        {
          this._request.setContentType (contentType);
        }
      }
      else
      */
      for (var key in headers)
      {
        this._request.setRequestHeader (key, headers[key]);
      }
      this._request.send (content);
    }
    else
    {
      this._request.open (this._method, this._url, true);
      // make sure is not cached
      headers [HEADER_CACHE_CONTROL] = "no-store, max-age=0";
      headers [HEADER_PRAGMA] = "no-cache";

      for (var key in headers)
      {
        this._request.setRequestHeader (key, headers[key]);
      }
      this._request.send ();
    }
    var spinner = document.getElementById (SPINNER);
    if (spinner)
    {
      spinner.style.display = "block";
    }
    this._content = null;
    return false;
  }
  return true;
};
/**
 *
 */
AJAXContainer.prototype._onReady = function()
{
  if (this._request.readyState == READY_STATE_COMPLETE)
  {
    switch (this._request.status)
    {
      case 230: // special handling for custom redirect
          loadURL (this._request.getResponseHeader("RedirectUrl"));
          return;

      case 302:
      case 303:
      case 307:
      case 308:
          loadURL (this._request.redirectUrl);
          return;

      default:
    }

    var spinner = document.getElementById (SPINNER);
    if (spinner)
    {
      spinner.style.display = "none";
    }

    if(this._renderer)
    {
      this._renderer (this);
    }
    //clean up
    delete this._request;
  }
};
/**************************************/

function init()
{
  var uid = document.getElementById (UID);
  if (uid)
  {
    uid.value = UUID();
  }

  var srcSid = document.getElementById (SOURCE_SID);
  if (srcSid)
  {
    let optSid;
    for (let src in SYSTEMS)
    {
      optSid = document.createElement("option");
      optSid.value=src;
      optSid.innerHTML=src;
      srcSid.appendChild (optSid);
    }
  }
}

function refresh()
{
  location.reload();
}
/**
 *
 */
function openPopup (name, inside, left, top, iconName)
{
  var output = "";
  output += "<div class='"+NODE_CLASS_POPUP_DECORATION+"' '>";
  output +=   "<div class='"+NODE_CLASS_POPUP_TITLE+"' >"+name+"</div>";
  output +=   "<div class='"+NODE_CLASS_POPUP_CONTROL+" "+NODE_CLASS_CONTROL_CLOSE+"' title='Close' onclick='closePopup(this);refresh();'></div>";
  output += "</div>";
  output += "<div class='"+NODE_CLASS_POPUP_BODY+"' onmousedown='return_false();'>";
  output +=    inside;
  output += "<div class='"+NODE_CLASS_POPUP_BUTTONS+"' >";
  output += "<input type='button' name='OK' value='OK' onclick='closePopup(this);refresh();'>";
  output += "</div>";
  output += "</div>";


  var popup = document.createElement("div");
  popup.className = NODE_CLASS_POPUP;
  popup.style.position= ABSOLUTE;
  popup.style.zIndex = 10000;

  document.body.appendChild (popup);

  popup.innerHTML = output;
  popup.style.cursor= AUTO;


  popup.style.visibility = VISIBLE;
  return popup;
}
/**
 * 
 * @param source
 * @returns
 */
function closePopup(source)
{
  var popup = source;
  while (popup.className != NODE_CLASS_POPUP)
  {
    popup = popup.parentNode;
  }
  if (popup.className == NODE_CLASS_POPUP)
  {
    popup.parentNode.removeChild (popup);
  }
}
/**
*
*/
function onRequestReadyPopup (request)
{
 openPopup (
            request._popupName,
            request._request.responseText,
            request._popupLeft,
            request._popupTop,
            request._close,
            request._max     && request._method == HTTP_METHOD_GET,
            request._refresh && request._method == HTTP_METHOD_GET,
            request._close);
}
/**
 *
 */
function setTargetSIDs(source)
{
  var sourceSID = "";
  for (var i = 0, len = source.options.length; i < len; i++ )
  {
    opt = source.options[i];
    if (opt.selected === true )
    {
      sourceSID = opt.value;
      break;
    }
  }

  var targets = SYSTEMS [sourceSID];
  if (targets)
  {
    for (var j=0; j < targets.length;j++)
    {
      var tgt = targets[j];

      var tgtChk = document.getElementById (TARGET_CHK_PFX+(j+1));

      if (!tgtChk) break;

      tgtChk.value = tgt;
      tgtChk.checked=false;
      tgtChk.style.visibility=VISIBLE;

      var tgtLbl = document.getElementById (TARGET_LBL_PFX+(j+1));
      if (tgtLbl) tgtLbl.innerText=tgt;
    }
  }
  else
  {
    for (var k=1;k<10;k++)
    {
      var tgtChk = document.getElementById (TARGET_CHK_PFX+k);

      if (!tgtChk) break;

      tgtChk.value = null;
      tgtChk.checked = false;
      tgtChk.style.visibility=HIDDEN;

      var tgtLbl = document.getElementById (TARGET_LBL_PFX+k);
      if (tgtLbl) tgtLbl.innerText="";
    }
  }
  return false;
}
//
function changeTargetSID(source)
{
  var target = document.getElementById (TARGET_SID_PFX+source.getAttribute ("tgt"));
  if (target)
  {
    if (source.checked)
    {
      target.value = source.value; 
    }
    else
    {
      target.value = "";
    }
  }
  return false;
}
//
function validateRequest(form)
{
  var uid = document.getElementById (UID);
  if (!uid.balue || uid.value == "")
  {
    uid.value = UUID();
  }

  var comments = document.getElementById (COMMENTS);
  if (!comments || !comments.value || comments.value == "")
  {
    alert("Comments can't be empty");
    return false;
  }

  var srcSid = document.getElementById (SOURCE_SID);
  if (!srcSid || !srcSid.value || srcSid.value == "")
  {
    alert("Select Source SID first");
    return false;
  }

  var tgtSid1 = document.getElementById (TARGET_CHK_PFX+1);
  var tgtSid2 = document.getElementById (TARGET_CHK_PFX+2);
  if (!tgtSid1.checked && !tgtSid2.checked)
  {
    alert("Select one of the Target SIDs first");
    return false;
  }

  // fill the input 
  var tgtSids = document.getElementById (TARGET_SIDS);
  tgtSids.value = "";
  if (tgtSid1.checked && tgtSid1.value)
  {
    tgtSids.value = tgtSid1.value; 
  }

  if (tgtSid2.checked && tgtSid2.value)
  {
    if (tgtSids.value != "") tgtSids.value +=", ";
    tgtSids.value += tgtSid2.value; 
  }

  var user = document.getElementById (REQUESTOR);
  if (!user || !user.value || user.value == "")
  {
    alert("Select Requestor User ID first");
    return false;
  }

  var customReqs    = document.getElementById (REQUEST_CUSTOM_ID);
  var workbenchReqs = document.getElementById (REQUEST_WORKB_ID);

//	customReqs.value = "";

	// cleanup initial
  workbenchReqs.value = "";

  for (var i=0; i < form.elements.length;i++)
  {
    var next = form.elements [i];
    // vaidate transport request
    if (next.getAttribute("section") == SECTION_WRKBNCH) // workbench requests
    {
      if (next.value && next.value != "")
      {
        if(next.value.indexOf(srcSid.value) != 0)
        {
          alert("Invalid Transport Request: "+next.value+"! Has to start with "+srcSid.value+"...");
          return false;
        }
        
        if (workbenchReqs.value != "") workbenchReqs.value+=", ";
        workbenchReqs.value+=next.value;
      }
    }
 //   else if (next.getAttribute("section") == SECTION_CUSTOM) // custom requests
//    {
//      if(next.value && next.value != "")
//      {
//        if(next.value.indexOf(srcSid.value) != 0)
//        {
//          alert("Invalid Transport Request: "+next.value+"! Has to start with "+srcSid.value+"...");
//          return false;
//        }

 //       if (customReqs.value != "") customReqs.value+=", ";
 //       customReqs.value+=next.value;
 //     }
 //   }
  }
  
//  if (customReqs.value == "" && workbenchReqs.value == "")
  if (workbenchReqs.value == "")
  {
    alert("Specify at least one Transport Request");
    return false;
  }
  return true;
}
//
function addRequests()
{
  var reqTable = document.getElementById (REQUEST_TABLE);
  
  // add 5 more records
  for (var i=1; i <= 5; i++)
  {
    var tr = document.createElement("tr");
    tr.className="row";

//    var td1 = document.createElement("td");
//    td1.className="customizing";
//    tr.appendChild (td1);
//    var input1 = document.createElement("input");
//    input1.className="request";
//    input1.type="TEXT";
//    input1.setAttribute ("section", SECTION_CUSTOM);
//    td1.appendChild (input1);

    var td2 = document.createElement("td");
    td2.className="workbench";
    tr.appendChild (td2);
    var input2 = document.createElement("input");
    input2.className="request";
    input2.type="TEXT";
    input2.setAttribute("section", SECTION_WRKBNCH);
    td2.appendChild (input2);

    reqTable.appendChild (tr);
  }
  return false;
}

function submitRequest(source, title)
{
  var form = source.form;
  if (form)
  {
    if (!validateRequest(form))
    {
      return;
    }
  }
  // build URL
  var url = "/"+CHANGE_REQUEST_CLASS+"?"; //form.action + "?";
  for (var i=0; i < form.elements.length;i++)
  {
    var next = form.elements [i];
    if (next.name)
    {
      url += encodeURIComponent(next.name)+"="+encodeURIComponent(next.value)+"&";
    }
  }
  
  new AJAXContainer (
                     null,
                     url,
                     title,
                     null, null, // left,top
                     onRequestReadyPopup,
                     true, // close
                     HTTP_METHOD_POST);
}
