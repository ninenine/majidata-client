Ext.grid.RowExpander=function(a){Ext.apply(this,a);this.addEvents({beforeexpand:!0,expand:!0,beforecollapse:!0,collapse:!0,init:!0});Ext.grid.RowExpander.superclass.constructor.call(this);if(this.tpl){if("string"==typeof this.tpl)this.tpl=new Ext.Template(this.tpl);this.tpl.compile()}this.state={};this.bodyContent={}};
Ext.extend(Ext.grid.RowExpander,Ext.util.Observable,{header:"",width:20,sortable:!1,fixed:!0,menuDisabled:!0,dataIndex:"",id:"expander",lazyRender:!0,enableCaching:!0,getRowClass:function(a,b,c){c.cols-=1;var d=this.bodyContent[a.id];!d&&!this.lazyRender&&(d=this.getBodyContent(a,b));if(d)c.body=d;return this.state[a.id]?"x-grid3-row-expanded":"x-grid3-row-collapsed"},init:function(a){this.grid=a;var b=a.getView();b.getRowClass=this.getRowClass.createDelegate(this);b.enableRowBody=!0;a.on("render",
function(){b.mainBody.on("mousedown",this.onMouseDown,this)},this);this.fireEvent("init",this)},getBodyContent:function(a){if(!this.enableCaching)return this.tpl.apply(a.data);var b=this.bodyContent[a.id];b||(b=this.tpl.apply(a.data),this.bodyContent[a.id]=b);return b},onMouseDown:function(a,b){"x-grid3-row-expander"==b.className&&(a.stopEvent(),this.toggleRow(a.getTarget(".x-grid3-row")))},renderer:function(a,b){b.cellAttr='rowspan="2"';return'<div class="x-grid3-row-expander">&#160;</div>'},beforeExpand:function(a,
b,c){if(!1!==this.fireEvent("beforeexpand",this,a,b,c)){if(this.tpl&&this.lazyRender)b.innerHTML=this.getBodyContent(a,c);return!0}return!1},toggleRow:function(a){"number"==typeof a&&(a=this.grid.view.getRow(a));this[Ext.fly(a).hasClass("x-grid3-row-collapsed")?"expandRow":"collapseRow"](a)},expandRow:function(a){"number"==typeof a&&(a=this.grid.view.getRow(a));var b=this.grid.store.getAt(a.rowIndex),c=Ext.DomQuery.selectNode("tr:nth(2) div.x-grid3-row-body",a);this.beforeExpand(b,c,a.rowIndex)&&
(this.state[b.id]=!0,Ext.fly(a).replaceClass("x-grid3-row-collapsed","x-grid3-row-expanded"),this.fireEvent("expand",this,b,c,a.rowIndex))},collapseRow:function(a){"number"==typeof a&&(a=this.grid.view.getRow(a));var b=this.grid.store.getAt(a.rowIndex),c=Ext.fly(a).child("tr:nth(1) div.x-grid3-row-body",!0);!1!==this.fireEvent("beforecollapse",this,b,c,a.rowIndex)&&(this.state[b.id]=!1,Ext.fly(a).replaceClass("x-grid3-row-expanded","x-grid3-row-collapsed"),this.fireEvent("collapse",this,b,c,a.rowIndex))}});
Ext.namespace("Styler");Styler.ColorManager=function(a){Ext.apply(this,a)};
Ext.apply(Styler.ColorManager.prototype,{field:null,init:function(a){this.register(a)},destroy:function(){this.field&&this.unregister(this.field)},register:function(a){this.field&&this.unregister(this.field);this.field=a;a.on({focus:this.fieldFocus,destroy:this.destroy,scope:this})},unregister:function(a){a.un("focus",this.fieldFocus,this);a.un("destroy",this.destroy,this);Styler.ColorManager.picker&&a==this.field&&Styler.ColorManager.picker.un("pickcolor",this.setFieldValue,this);this.field=null},
fieldFocus:function(){if(!Styler.ColorManager.pickerWin)Styler.ColorManager.picker=new Ext.ux.ColorPanel({hidePanel:!1,autoHeight:!1}),Styler.ColorManager.pickerWin=new Ext.Window({title:"Color Picker",layout:"fit",closeAction:"hide",width:405,height:300,plain:!0,items:Styler.ColorManager.picker});Styler.ColorManager.picker.purgeListeners();this.setPickerValue();Styler.ColorManager.picker.on({pickcolor:this.setFieldValue,scope:this});Styler.ColorManager.pickerWin.show()},setFieldValue:function(a,
b){this.field.isVisible()&&this.field.setValue("#"+b)},setPickerValue:function(){var a=this.field;(a=a.getHexValue?a.getHexValue():a.getValue())&&Styler.ColorManager.picker.setColor(a.substring(1))}});Styler.ColorManager.picker=null;Styler.ColorManager.pickerWin=null;Ext.namespace("Ext.ux");Ext.ux.ColorPicker=function(a){a.bodyStyle={padding:"3px"};Ext.ux.ColorPicker.superclass.constructor.call(this,a);this.initialize(a)};
Ext.extend(Ext.ux.ColorPicker,Ext.util.Observable,{HCHARS:"0123456789ABCDEF",initialize:function(a){this.events={};this.config=this.config||a;this.config.captions=this.config.captions||{};this.config.pickerHotPoint=this.config.pickerHotPoint||{x:3,y:3};this._HSV={h:0,s:100,v:100};this._RGB={r:255,g:255,b:255};this._HEX="000000";this.lastXYRgb={x:0,y:0};this.lastYHue=0;this.domElement=this.config.renderTo||Ext.DomHelper.append(document.body,{},!0);this.domElement.addClass("x-cp-panel");this.cpCreateDomObjects();
this.config.hidePanel&&this.formContainer.hide();this.rgbPicker.on("mousedown",this.rgbPickerClick.createDelegate(this),this);this.huePicker.on("mousedown",this.huePickerClick.createDelegate(this),this);this.wsColorContainer.on("mousedown",this.setColorFromWebsafe.createDelegate(this),this);this.inColorContainer.on("mousedown",this.setColorFromInvert.createDelegate(this),this);Ext.getCmp("redValue"+this.domElement.id).on("change",this.changeRGBField.createDelegate(this));Ext.getCmp("greenValue"+this.domElement.id).on("change",
this.changeRGBField.createDelegate(this));Ext.getCmp("blueValue"+this.domElement.id).on("change",this.changeRGBField.createDelegate(this));Ext.getCmp("hueValue"+this.domElement.id).on("change",this.changeHSVField.createDelegate(this));Ext.getCmp("saturationValue"+this.domElement.id).on("change",this.changeHSVField.createDelegate(this));Ext.getCmp("brightnessValue"+this.domElement.id).on("change",this.changeHSVField.createDelegate(this));Ext.getCmp("colorValue"+this.domElement.id).on("change",this.changeHexaField.createDelegate(this));
Ext.getCmp("redValue"+this.domElement.id).on("specialkey",this.changeRGBField.createDelegate(this));Ext.getCmp("greenValue"+this.domElement.id).on("specialkey",this.changeRGBField.createDelegate(this));Ext.getCmp("blueValue"+this.domElement.id).on("specialkey",this.changeRGBField.createDelegate(this));Ext.getCmp("hueValue"+this.domElement.id).on("specialkey",this.changeHSVField.createDelegate(this));Ext.getCmp("saturationValue"+this.domElement.id).on("specialkey",this.changeHSVField.createDelegate(this));
Ext.getCmp("brightnessValue"+this.domElement.id).on("specialkey",this.changeHSVField.createDelegate(this));Ext.getCmp("colorValue"+this.domElement.id).on({specialkey:function(a,c){c.getKey()===c.ENTER&&this.changeHexaField(a,a.getValue())},scope:this});this.checkConfig();this.addEvents({pickcolor:!0,changergb:!0,changehsv:!0,changehexa:!0})},cpCreateDomObjects:function(){this.rgbPicker=Ext.DomHelper.append(this.domElement,{tag:"div",cls:"x-cp-rgb-msk"},!0);this.rgbPointer=Ext.DomHelper.append(this.rgbPicker,
{tag:"div",cls:"x-cp-rgb-picker"},!0);this.rgbPointer.setXY([this.rgbPicker.getLeft()-this.config.pickerHotPoint.x,this.rgbPicker.getTop()-this.config.pickerHotPoint.y]);this.huePicker=Ext.DomHelper.append(this.domElement,{tag:"div",cls:"x-cp-hue-msk"},!0);this.huePointer=Ext.DomHelper.append(this.huePicker,{tag:"div",cls:"x-cp-hue-picker"},!0);this.huePointer.setXY([this.huePicker.getLeft()+this.huePointer.getWidth()/2+1,this.huePicker.getTop()-this.config.pickerHotPoint.y]);this.formContainer=Ext.DomHelper.append(Ext.DomHelper.append(this.domElement,
{tag:"div",cls:"x-cp-control-container"},!0),{tag:"div",cls:"x-cp-rgb-container",style:"clear:both"},!0);this.colorContainer=Ext.DomHelper.append(this.formContainer,{cls:"x-cp-coloro-container"},!0).update(this.config.captions.color||"Color");this.form=new Ext.FormPanel({frame:!0,width:"auto",height:227,cls:"x-cp-form",labelWidth:12,items:[{xtype:"fieldset",title:"RGB",autoHeight:!0,style:"padding: 2px",defaultType:"numberfield",items:[{fieldLabel:"Red",id:"redValue"+this.domElement.id},{fieldLabel:"Green",
id:"greenValue"+this.domElement.id},{fieldLabel:"Blue",id:"blueValue"+this.domElement.id}]},{xtype:"fieldset",title:"HSV",autoHeight:!0,style:"padding: 2px",defaultType:"numberfield",items:[{fieldLabel:"Hue",id:"hueValue"+this.domElement.id},{fieldLabel:"Satur.",id:"saturationValue"+this.domElement.id},{fieldLabel:"Bright.",id:"brightnessValue"+this.domElement.id}]},{xtype:"fieldset",title:"Color",autoHeight:!0,style:"padding: 2px",defaultType:"textfield",items:[{fieldLabel:"Color",id:"colorValue"+
this.domElement.id}]}]});this.form.render(this.formContainer);var a=Ext.DomHelper.append(this.form.body,{cls:"x-cp-colors-container x-unselectable"},!0);this.wsColorContainer=Ext.DomHelper.append(a,{cls:"x-cp-color-container x-unselectable"},!0).update(this.config.captions.websafe||"Websafe");this.inColorContainer=Ext.DomHelper.append(a,{cls:"x-cp-color-container x-unselectable"},!0).update(this.config.captions.inverse||"Inverse");Ext.DomHelper.append(a,{tag:"div",style:"height:0px;border:none;clear:both;font-size:1px;"});
this.form.render(this.formContainer);Ext.DomHelper.append(this.domElement,{tag:"div",style:"height:0px;border:none;clear:both;font-size:1px;"})},realToDec:function(a){return Math.min(255,Math.round(256*a))},hsvToRgb:function(a,b,c){if(a instanceof Array)return this.hsvToRgb.call(this,a[0],a[1],a[2]);var d,e,f,g,i,h;g=Math.floor(a/60%6);i=a/60-g;a=c*(1-b);h=c*(1-i*b);b=c*(1-(1-i)*b);switch(g){case 0:d=c;e=b;f=a;break;case 1:d=h;e=c;f=a;break;case 2:d=a;e=c;f=b;break;case 3:d=a;e=h;f=c;break;case 4:d=
b;e=a;f=c;break;case 5:d=c,e=a,f=h}return[this.realToDec(d),this.realToDec(e),this.realToDec(f)]},rgbToHsv:function(a,b,c){if(a instanceof Array)return this.rgbToHsv.call(this,a[0],a[1],a[2]);var a=a/255,b=b/255,c=c/255,d,e,f,g;d=Math.min(Math.min(a,b),c);e=Math.max(Math.max(a,b),c);f=e-d;switch(e){case d:g=0;break;case a:g=60*(b-c)/f;b<c&&(g+=360);break;case b:g=60*(c-a)/f+120;break;case c:g=60*(a-b)/f+240}return[Math.round(g),0===e?0:1-d/e,e]},rgbToHex:function(a,b,c){return a instanceof Array?
this.rgbToHex.call(this,a[0],a[1],a[2]):this.decToHex(a)+this.decToHex(b)+this.decToHex(c)},decToHex:function(a){a=parseInt(a,10);a=!isNaN(a)?a:0;a=255<a||0>a?0:a;return this.HCHARS.charAt((a-a%16)/16)+this.HCHARS.charAt(a%16)},getHCharPos:function(a){return this.HCHARS.indexOf(a.toUpperCase())},hexToDec:function(a){a=a.split("");return 16*this.getHCharPos(a[0])+this.getHCharPos(a[1])},hexToRgb:function(a){return[this.hexToDec(a.substr(0,2)),this.hexToDec(a.substr(2,2)),this.hexToDec(a.substr(4,2))]},
checkSafeNumber:function(a){if(!isNaN(a)){var a=Math.min(Math.max(0,a),255),b,c;for(b=0;256>b;b+=51)if(c=b+51,a>=b&&a<=c)return 25<a-b?c:b}return a},websafe:function(a,b,c){return a instanceof Array?this.websafe.call(this,a[0],a[1],a[2]):[this.checkSafeNumber(a),this.checkSafeNumber(b),this.checkSafeNumber(c)]},invert:function(a,b,c){return a instanceof Array?this.invert.call(this,a[0],a[1],a[2]):[255-a,255-b,255-c]},getHue:function(a){a=360-Math.round(360*((this.huePicker.getHeight()-a)/this.huePicker.getHeight()));
return 360===a?0:a},getHPos:function(a){return a*(this.huePicker.getHeight()/360)},getSaturation:function(a){return a/this.rgbPicker.getWidth()},getSPos:function(a){return a*this.rgbPicker.getWidth()},getValue:function(a){return(this.rgbPicker.getHeight()-a)/this.rgbPicker.getHeight()},getVPos:function(a){return this.rgbPicker.getHeight()-a*this.rgbPicker.getHeight()},updateColorsFromRGBPicker:function(){this._HSV={h:this._HSV.h,s:this.getSaturation(this.lastXYRgb.x),v:this.getValue(this.lastXYRgb.y)}},
updateColorsFromHUEPicker:function(){this._HSV.h=this.getHue(this.lastYHue);var a=this.hsvToRgb(this._HSV.h,1,1),a=this.rgbToHex(a[0],a[1],a[2]);this.rgbPicker.setStyle({backgroundColor:"#"+a})},updateColorsFromRGBFields:function(){var a=this.rgbToHsv(Ext.getCmp("redValue"+this.domElement.id).getValue(),Ext.getCmp("greenValue"+this.domElement.id).getValue(),Ext.getCmp("blueValue"+this.domElement.id).getValue());this._HSV={h:a[0],s:a[1],v:a[2]}},updateColorsFromHexaField:function(){var a=this.hexToRgb(this._HEX);
this._RGB={r:a[0],g:a[1],b:a[2]};a=this.rgbToHsv(a[0],a[1],a[2]);this._HSV={h:a[0],s:a[1],v:a[2]}},updateColorsFromHSVFields:function(){var a=this.hsvToRgb(this._HSV.h,this._HSV.s,this._HSV.v);this._RGB={r:a[0],g:a[1],b:a[2]}},updateRGBFromHSV:function(){var a=this.hsvToRgb(this._HSV.h,this._HSV.s,this._HSV.v);this._RGB={r:a[0],g:a[1],b:a[2]}},updateInputFields:function(){Ext.getCmp("redValue"+this.domElement.id).setValue(this._RGB.r);Ext.getCmp("greenValue"+this.domElement.id).setValue(this._RGB.g);
Ext.getCmp("blueValue"+this.domElement.id).setValue(this._RGB.b);Ext.getCmp("hueValue"+this.domElement.id).setValue(this._HSV.h);Ext.getCmp("saturationValue"+this.domElement.id).setValue(Math.round(100*this._HSV.s));Ext.getCmp("brightnessValue"+this.domElement.id).setValue(Math.round(100*this._HSV.v));Ext.getCmp("colorValue"+this.domElement.id).setValue(this._HEX)},updateColor:function(){this._HEX=this.rgbToHex(this._RGB.r,this._RGB.g,this._RGB.b);this.colorContainer.setStyle({backgroundColor:"#"+
this._HEX});this.colorContainer.set({title:"#"+this._HEX});var a=this.rgbToHex(this.websafe(this._RGB.r,this._RGB.g,this._RGB.b));this.wsColorContainer.setStyle({backgroundColor:"#"+a});this.wsColorContainer.set({title:"#"+a});this.wsColorContainer.setStyle({color:"#"+this.rgbToHex(this.invert(this.websafe(this._RGB.r,this._RGB.g,this._RGB.b)))});a=this.rgbToHex(this.invert(this._RGB.r,this._RGB.g,this._RGB.b));this.inColorContainer.setStyle({backgroundColor:"#"+a});this.inColorContainer.setStyle({color:"#"+
this._HEX});this.inColorContainer.set({title:"#"+a});this.colorContainer.setStyle({color:"#"+a});this.updateInputFields();this.fireEvent("pickcolor",this,this._HEX)},updatePickers:function(){this.lastXYRgb={x:this.getSPos(this._HSV.s),y:this.getVPos(this._HSV.v)};this.rgbPointer.setXY([this.lastXYRgb.x-this.config.pickerHotPoint.x+this.rgbPicker.getLeft(),this.lastXYRgb.y-this.config.pickerHotPoint.y+this.rgbPicker.getTop()],this.config.animate);this.lastYHue=this.getHPos(this._HSV.h);this.huePointer.setXY([this.huePicker.getLeft()+
this.huePointer.getWidth()/2+1,this.lastYHue+this.huePicker.getTop()-this.config.pickerHotPoint.y],this.config.animate);var a=this.hsvToRgb(this._HSV.h,1,1),a=this.rgbToHex(a[0],a[1],a[2]);this.rgbPicker.setStyle({backgroundColor:"#"+a})},rgbPickerClick:function(a){this.lastXYRgb={x:a.getPageX()-this.rgbPicker.getLeft(),y:a.getPageY()-this.rgbPicker.getTop()};this.rgbPointer.setXY([a.getPageX()-this.config.pickerHotPoint.x,a.getPageY()-this.config.pickerHotPoint.y],this.config.animate);this.updateColorsFromRGBPicker();
this.updateRGBFromHSV();this.updateColor()},huePickerClick:function(a){this.lastYHue=a.getPageY()-this.huePicker.getTop();this.huePointer.setY([a.getPageY()-3],this.config.animate);this.updateColorsFromHUEPicker();this.updateRGBFromHSV();this.updateColor()},changeRGBField:function(a,b){b instanceof String||(b=a.getValue());0>b&&(b=0);255<b&&(b=255);if(a==Ext.getCmp("redValue"+this.domElement.id))this._RGB.r=b;else if(a==Ext.getCmp("greenValue"+this.domElement.id))this._RGB.g=b;else if(a==Ext.getCmp("blueValue"+
this.domElement.id))this._RGB.b=b;this.updateColorsFromRGBFields();this.updateColor();this.updatePickers();this.fireEvent("changergb",this,this._RGB)},changeHSVField:function(a,b){b instanceof String||(b=a.getValue());if(a==Ext.getCmp("hueValue"+this.domElement.id))0>b&&(b=0),360<b&&(b=360),this._HSV.h=b;else if(0>b&&(b=0),100<b&&(b=100),a==Ext.getCmp("saturationValue"+this.domElement.id))this._HSV.s=b/100;else if(a==Ext.getCmp("brightnessValue"+this.domElement.id))this._HSV.v=b/100;this.updateColorsFromHSVFields();
this.updateColor();this.updatePickers();this.fireEvent("changehsv",this,this._HSV)},changeHexaField:function(a,b){b=b.trim().substring(0,6);3===b.length&&(b=b[0]+b[0]+b[1]+b[1]+b[2]+b[2]);b.match(/^[0-9a-f]{6}$/i)||(b="000000");this._HEX=b;this.updateColorsFromHexaField();this.updateColor();this.updatePickers();this.fireEvent("changehexa",this,this._HEX)},setColorFromWebsafe:function(){this.setColor(this.wsColorContainer.getColor("backgroundColor","",""))},setColorFromInvert:function(){this.setColor(this.inColorContainer.getColor("backgroundColor",
"",""))},checkConfig:function(){this.config&&(this.config.color?this.setColor(this.config.color):this.config.hsv?this.setHSV(this.config.hsv):this.config.rgb&&this.setRGB(this.config.rgb))},setColor:function(a){a=this.hexToRgb(a);this._RGB={r:a[0],g:a[1],b:a[2]};a=this.rgbToHsv(a);this._HSV={h:a[0],s:a[1],v:a[2]};this.updateColor();this.updatePickers()},setRGB:function(a){this._RGB=a;a=this.rgbToHsv(a.r,a.g,a.b);this._HSV={h:a[0],s:a[1],v:a[2]};this.updateColor();this.updatePickers()},setHSV:function(a){this._HSV=
{h:a.h,s:a.s/100,v:a.v/100};a=this.hsvToRgb(a.h,a.s/100,a.v/100);this._RGB={r:a[0],g:a[1],b:a[2]};this.updateColor();this.updatePickers()},getColor:function(a){return(a?"":"#")+this._HEX},getRGB:function(){return this._RGB},getHSV:function(){return this._HSV},setPanelVisible:function(a,b){return this.formContainer.setVisible(a,b)},isPanelVisible:function(){return this.formContainer.isDisplayed()},showPicker:function(){this.domElement.show()},hidePicker:function(){this.domElement.hide()}});
Ext.ux.ColorPanel=function(a){this.config=a;this.config.renderTo=this.config.renderTo||Ext.DomHelper.append(document.body,{},!0);Ext.ux.ColorPanel.superclass.constructor.call(this,a);this.domElement=Ext.get(this.config.renderTo);this.render(this.domElement);this.config.renderTo=this.body;this.initialize(this.config);this.getEl().addClass("x-cp-panel");this.domElement.removeClass("x-cp-panel");this.body.setStyle({padding:"5px"})};Ext.extend(Ext.ux.ColorPanel,Ext.Panel);
Ext.applyIf(Ext.ux.ColorPanel.prototype,Ext.ux.ColorPicker.prototype);
Ext.ux.ColorDialog=function(a){this.config=a;this.config.resizable=!1;this.config.renderTo=this.config.renderTo||Ext.DomHelper.append(document.body,{},!0);Ext.ux.ColorDialog.superclass.constructor.call(this,a);this.domElement=Ext.get(this.config.renderTo);this.render(this.domElement);this.config.renderTo=this.body;this.initialize(this.config);this.body.addClass("x-cp-panel");this.body.setStyle({padding:"5px"});this.setSize(398,300)};Ext.extend(Ext.ux.ColorDialog,Ext.Window);
Ext.applyIf(Ext.ux.ColorDialog.prototype,Ext.ux.ColorPicker.prototype);Ext.ns("Ext.ux.form");
Ext.ux.form.FileUploadField=Ext.extend(Ext.form.TextField,{buttonText:"Browse...",buttonOnly:!1,buttonOffset:3,readOnly:!0,autoSize:Ext.emptyFn,initComponent:function(){Ext.ux.form.FileUploadField.superclass.initComponent.call(this);this.addEvents("fileselected")},onRender:function(a,b){Ext.ux.form.FileUploadField.superclass.onRender.call(this,a,b);this.wrap=this.el.wrap({cls:"x-form-field-wrap x-form-file-wrap"});this.el.addClass("x-form-file-text");this.el.dom.removeAttribute("name");this.createFileInput();
var c=Ext.applyIf(this.buttonCfg||{},{text:this.buttonText});this.button=new Ext.Button(Ext.apply(c,{renderTo:this.wrap,cls:"x-form-file-btn"+(c.iconCls?" x-btn-icon":"")}));this.buttonOnly&&(this.el.hide(),this.wrap.setWidth(this.button.getEl().getWidth()));this.bindListeners();this.resizeEl=this.positionEl=this.wrap},bindListeners:function(){this.fileInput.on({scope:this,mouseenter:function(){this.button.addClass(["x-btn-over","x-btn-focus"])},mouseleave:function(){this.button.removeClass(["x-btn-over",
"x-btn-focus","x-btn-click"])},mousedown:function(){this.button.addClass("x-btn-click")},mouseup:function(){this.button.removeClass(["x-btn-over","x-btn-focus","x-btn-click"])},change:function(){var a=this.fileInput.dom.value;this.setValue(a);this.fireEvent("fileselected",this,a)}})},createFileInput:function(){this.fileInput=this.wrap.createChild({id:this.getFileInputId(),name:this.name||this.getId(),cls:"x-form-file",tag:"input",type:"file",size:1})},reset:function(){this.fileInput.remove();this.createFileInput();
this.bindListeners();Ext.ux.form.FileUploadField.superclass.reset.call(this)},getFileInputId:function(){return this.id+"-file"},onResize:function(a,b){Ext.ux.form.FileUploadField.superclass.onResize.call(this,a,b);this.wrap.setWidth(a);this.buttonOnly||(a=this.wrap.getWidth()-this.button.getEl().getWidth()-this.buttonOffset,this.el.setWidth(a))},onDestroy:function(){Ext.ux.form.FileUploadField.superclass.onDestroy.call(this);Ext.destroy(this.fileInput,this.button,this.wrap)},onDisable:function(){Ext.ux.form.FileUploadField.superclass.onDisable.call(this);
this.doDisable(!0)},onEnable:function(){Ext.ux.form.FileUploadField.superclass.onEnable.call(this);this.doDisable(!1)},doDisable:function(a){this.fileInput.dom.disabled=a;this.button.setDisabled(a)},preFocus:Ext.emptyFn,alignErrorIcon:function(){this.errorIcon.alignTo(this.wrap,"tl-tr",[2,0])}});Ext.reg("fileuploadfield",Ext.ux.form.FileUploadField);Ext.form.FileUploadField=Ext.ux.form.FileUploadField;