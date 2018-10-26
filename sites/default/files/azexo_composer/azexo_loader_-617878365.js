(function($) {
if('azexo_backend' in window) return;
var azexo_frontend = true;
var p = 'ax-';var fp = 'ax_';
function t(text) {
        if ('azexo_t' in window) {
            return window.azexo_t(text);
        } else {
            return text;
        }
    }
function lang() {
        if ('azexo_lang' in window) {
            return window.azexo_lang;
        } else {
            return 'en';
        }
    }
function azexo_load_container(type, name, callback) {
        if (azexo_containers_loaded.hasOwnProperty(type + '/' + name)) {
            callback(azexo_containers_loaded[type + '/' + name]);
            return;
        }
        if (window.azexo_online) {
            if ('ajaxurl' in window) {
                $.ajax({
                    type: 'POST',
                    url: window.ajaxurl,
                    data: {
                        action: 'azexo_load_container',
                        type: type,
                        name: name,
                    },
                    cache: !window.azexo_editor,
                }).done(function(data) {
                    azexo_containers_loaded[type + '/' + name] = data;
                    callback(data);
                }).fail(function() {
                    callback('');
                });
            } else {
                type = (type === '') ? 'default' : type;
                var url = window.azexo_baseurl + '../azexo_containers/' + type + '/' + name;
                $.ajax({
                    url: url,
                    cache: !window.azexo_editor,
                }).done(function(data) {
                    azexo_containers_loaded[type + '/' + name] = data;
                    callback(data);
                }).fail(function() {
                    callback('');
                });
            }
        } else {
            type = (type === '') ? 'default' : type;
            azexo_add_js({
                path: '../azexo_containers/' + type + '/' + name + '.js',
                callback: function() {
                    var data = window['azexo_container_' + type + '_' + name];
                    callback(decodeURIComponent(atob(data)));
                }
            });
        }
    }
function extend(Child, Parent) {
        var F = function() {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.baseclass = Parent;
    }
function mixin(dst, src) {
        var tobj = {};
        for (var x in src) {
            if ((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
                dst[x] = src[x];
            }
        }
        if (document.all && !document.isOpera) {
            var p = src.toString;
            if (typeof p == "function" && p != dst.toString && p != tobj.toString &&
                    p != "\nfunction toString() {\n    [native code]\n}\n") {
                dst.toString = src.toString;
            }
        }
        return dst;
    }
function substr_replace(str, replace, start, length) {
        if (start < 0) { // start position in str
            start = start + str.length;
        }
        length = length !== undefined ? length : str.length;
        if (length < 0) {
            length = length + str.length - start;
        }

        return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
    }
function unescapeParam(value) {
        if (_.isString(value))
            return value.replace(/(\`{2})/g, '"');
        else
            return value;
    }
$.fn.closest_descendents = function(filter) {
        var $found = $(),
                $currentSet = this;
        while ($currentSet.length) {
            $found = $.merge($found, $currentSet.filter(filter));
            $currentSet = $currentSet.not(filter);
            $currentSet = $currentSet.children();
        }
        return $found;
    } 
function BaseParamType() {
        this.dom_element = null;
        this.heading = '';
        this.description = '';
        this.param_name = '';
        this.required = false;
        this.admin_label = '';
        this.holder = '';
        this.wrapper_class = '';
        this.value = null;
        this.can_be_empty = false;
        this.hidden = false;
        this.tab = '';
        this.dependency = {};
        if ('create' in this) {
            this.create();
        }
    }
BaseParamType.prototype.safe = true;
BaseParamType.prototype.param_types = {};
function make_param_type(settings) {
        if (settings.type in BaseParamType.prototype.param_types) {
            var new_param = new BaseParamType.prototype.param_types[settings.type];
            mixin(new_param, settings);
            return new_param;
        } else {
            var new_param = new BaseParamType();
            mixin(new_param, settings);
            return new_param;
        }
    }
window.azexo_add_css=function(path, callback) {
        var url = window.azexo_baseurl + path;
        if ($('link[href*="' + url + '"]').length || 'azexo_exported' in window) {
            callback();
            return;
        }
        var head = document.getElementsByTagName('head')[0];
        var stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        stylesheet.href = url;
        stylesheet.onload = callback;
        head.appendChild(stylesheet);
    }
window.azexo_add_js=function(options) {
        if ('loaded' in options && options.loaded || 'azexo_exported' in window) {
            options.callback();
        } else {
            azexo_add_external_js(window.azexo_baseurl + options.path, 'callback' in options ? options.callback : function() {
            });
        }
    }
window.azexo_add_js_list=function(options) {
        if ('loaded' in options && options.loaded) {
            options.callback();
        } else {
            var counter = 0;
            for (var i = 0; i < options.paths.length; i++) {
                azexo_add_js({
                    path: options.paths[i],
                    callback: function() {
                        counter++;
                        if (counter == options.paths.length) {
                            options.callback();
                        }
                    }});
            }
        }
    }
var azexo_js_waiting_callbacks = {};
var azexo_loaded_js = {};
window.azexo_add_external_js=function(url, callback) {
        if (url in azexo_js_waiting_callbacks) {
            azexo_js_waiting_callbacks[url].push(callback);
            return;
        } else {
            if (url in azexo_loaded_js) {
                callback();
                return;
            }
        }
        azexo_js_waiting_callbacks[url] = [callback];
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            azexo_loaded_js[url] = true;
            while (url in azexo_js_waiting_callbacks) {
                var callbacks = azexo_js_waiting_callbacks[url];
                azexo_js_waiting_callbacks[url] = undefined;
                delete azexo_js_waiting_callbacks[url];
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i]();
                }
            }
        };
        head.appendChild(script);
    }
function AZEXOElements() {
    }
AZEXOElements.prototype.elements_instances = {};
AZEXOElements.prototype.elements_instances_by_an_name = {};
AZEXOElements.prototype.get_element=function(id) {
            return this.elements_instances[id];
        }
AZEXOElements.prototype.delete_element=function(id) {
            $(document).trigger("azexo_delete_element", id);
            delete this.elements_instances[id];
        }
AZEXOElements.prototype.add_element=function(id, element, position) {
            this.elements_instances[id] = element;
            $(document).trigger("azexo_add_element", {id: id, position: position});
        }
function BaseElement(parent, position) {
        if (azexo_frontend)
            this.id = _.uniqueId('f');
        else
            this.id = _.uniqueId('b');
        if (parent != null) {
            this.parent = parent;
            if (typeof position === 'boolean') {
                if (position)
                    parent.children.push(this);
                else
                    parent.children.unshift(this);
            } else {
                parent.children.splice(position, 0, this);
            }
        }
        //
        this.children = [];
        this.dom_element = null;
        this.dom_content_element = null;
        this.attrs = {};
        for (var i = 0; i < this.params.length; i++) {
            if (_.isString(this.params[i].value))
                this.attrs[this.params[i].param_name] = this.params[i].value;
            else {
                if (!this.params[i].hidden)
                    this.attrs[this.params[i].param_name] = '';
//            if (_.isArray(this.params[i].value)) {
//                this.attrs[this.params[i].param_name] = this.params[i].value[0];
//            } else {
//                if (_.isObject(this.params[i].value)) {
//                    var keys = _.keys(this.params[i].value);
//                    this.attrs[this.params[i].param_name] = keys[0];
//                } else {
//                    this.attrs[this.params[i].param_name] = null;
//                }
//            }
            }
        }
        this.controls = null;
        azexo_elements.add_element(this.id, this, position);
    }
BaseElement.prototype.p = 'ax-';
BaseElement.prototype.fp = 'ax_';
BaseElement.prototype.elements = {};
BaseElement.prototype.tags = {};
BaseElement.prototype.params=[{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true}];
BaseElement.prototype.get_hover_style=function() {
            if ('hover_style' in this.attrs)
                return '<style id="hover-style-' + this.id + '">.hover-style-' + this.id + ':hover ' + this.style_selector + ' { ' + this.attrs['hover_style'] + '} </style>';
            else
                return '';
        }
BaseElement.prototype.showed=function($, p, fp) {
            if ('pos_left' in this.attrs && this.attrs['pos_left'] != '')
                $(this.dom_element).css("left", this.attrs['pos_left']);
            if ('pos_right' in this.attrs && this.attrs['pos_right'] != '')
                $(this.dom_element).css("right", this.attrs['pos_right']);
            if ('pos_top' in this.attrs && this.attrs['pos_top'] != '')
                $(this.dom_element).css("top", this.attrs['pos_top']);
            if ('pos_bottom' in this.attrs && this.attrs['pos_bottom'] != '')
                $(this.dom_element).css("bottom", this.attrs['pos_bottom']);
            if ('pos_width' in this.attrs && this.attrs['pos_width'] != '')
                $(this.dom_element).css("width", this.attrs['pos_width']);
            if ('pos_height' in this.attrs && this.attrs['pos_height'] != '')
                $(this.dom_element).css("height", this.attrs['pos_height']);
            if ('pos_zindex' in this.attrs && this.attrs['pos_zindex'] != '')
                $(this.dom_element).css("z-index", this.attrs['pos_zindex']);
            if ('hover_style' in this.attrs && this.attrs['hover_style'] != '') {
                $('head').find('#hover-style-' + this.id).remove();
                $('head').append(this.get_hover_style());
                $(this.dom_element).addClass('hover-style-' + this.id);
            }
        }
BaseElement.prototype.render=function($, p, fp) {
            $(this.dom_element).attr('data-az-id', this.id);
        }
BaseElement.prototype.recursive_render=function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_render();
            }
            if (azexo_frontend) {
                if (this.frontend_render) {
                    this.detach_children();
                    this.parent.detach_children();
                    this.render($, p, fp);
                    this.attach_children();
                    this.parent.attach_children();
                }
            } else {
                this.render($, p, fp);
                this.attach_children();
            }
            if (window.azexo_editor) {
                this.show_controls();
                this.update_sortable();
            }
        }
BaseElement.prototype.replace_render=function() {
            var dom_element = this.dom_element;
            var dom_content_element = this.dom_content_element;
            if (dom_element != null) {
                this.render($, p, fp);
                $(dom_element).replaceWith(this.dom_element);
                if (dom_content_element != null) {
                    $(this.dom_content_element).replaceWith(dom_content_element);
                }
            }
            if (window.azexo_editor)
                this.show_controls();
        }
BaseElement.prototype.update_dom=function() {
            this.detach_children();
            $(this.dom_element).remove();
            this.parent.detach_children();
            this.render($, p, fp);
            this.attach_children();
            if (window.azexo_editor)
                this.show_controls();
            this.parent.attach_children();
            if (window.azexo_editor) {
                this.update_sortable();
                this.update_empty();
            }
            this.showed($, p, fp);
        }
BaseElement.prototype.attach_children=function() {
            for (var i = 0; i < this.children.length; i++) {
                $(this.dom_content_element).append(this.children[i].dom_element);
            }
        }
BaseElement.prototype.detach_children=function() {
            for (var i = 0; i < this.children.length; i++) {
                $(this.children[i].dom_element).detach();
            }
        }
BaseElement.prototype.recursive_showed=function() {
            this.showed($, p, fp);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].recursive_showed();
            }
        }
BaseElement.prototype.parse_attrs=function(attrs) {
            for (var i = 0; i < this.params.length; i++) {
                var param = this.params[i];
                if (param.param_name in attrs) {
                    if (!param.safe) {
                        var value = unescapeParam(attrs[param.param_name]);
                        this.attrs[param.param_name] = decodeURIComponent(atob(value.replace(/^#E\-8_/, '')));
                    } else {
                        this.attrs[param.param_name] = unescapeParam(attrs[param.param_name]);
                    }
                } else {
                    if ('value' in param && _.isString(param.value)) {
                        this.attrs[param.param_name] = param.value;
                    }
                }
            }
            for (var name in attrs) {
                if (!(name in this.attrs)) {
                    this.attrs[name] = attrs[name];
                }
            }
            $(document).trigger("azexo_edited_element", this.id);
        }
BaseElement.prototype.parse_html=function(dom_element) {
            var element = this;
            if (($(dom_element).children().closest_descendents('[data-azb]').length == 0) && ($.trim($(dom_element).html()).length > 0)) {
                var row = new RowElement(element, false);
                row.children = [];
                var column = new ColumnElement(row, false);
                var constructor = BaseElement.prototype.elements['az_text'];
                var child = new constructor(column, false);
                child.attrs['content'] = $(dom_element).html();
                child.update_dom();
                if ('update_empty' in element)
                    element.update_empty();
                if ('update_empty' in column)
                    column.update_empty();
                if ('update_empty' in row)
                    row.update_empty();
            } else {
                $(dom_element).children().closest_descendents('[data-azb]').each(function() {
                    var tag = $(this).attr('data-azb');
                    var constructor = UnknownElement;
                    if (tag in BaseElement.prototype.tags) {
                        constructor = BaseElement.prototype.tags[tag];
                    }
                    var child = new constructor(element, true);

                    if (azexo_frontend) {
                        azexo_elements.elements_instances[child.id] = null;
                        delete azexo_elements.elements_instances[child.id];
                        child.id = $(this).attr('data-az-id');
                        azexo_elements.elements_instances[child.id] = child;
                    }

                    child.dom_element = $(this);
                    var attrs = {};
                    $($(this)[0].attributes).each(function() {
                        if (this.nodeName.indexOf('data-azat') >= 0) {
                            attrs[this.nodeName.replace('data-azat-', '')] = this.value;
                        }
                    });
                    child.parse_attrs(attrs);
                    if (child.is_container) {
                        var cnt = $(this).closest_descendents('[data-azcnt]');
                        if (cnt.length > 0) {
                            child.dom_content_element = $(cnt);
                            if (child.has_content) {
                                if (child instanceof UnknownElement) {
                                    child.attrs['content'] = $(cnt).wrap('<div></div>').parent().html();
                                    $(cnt).unwrap();
                                } else {
                                    child.attrs['content'] = $(cnt).html();
                                }
                            } else {
                                child.parse_html(cnt);
                            }
                        }
                    }
                });
            }
        }
BaseElement.prototype.add_css=function(path, loaded, callback) {
            var container = this.get_my_container();
            container.css[window.azexo_baseurl + path] = true;
            if (!loaded) {
                window.azexo_add_css(path, callback);
            }
        }
BaseElement.prototype.add_js_list=function(options) {
            var container = this.get_my_container();
            for (var i = 0; i < options.paths.length; i++) {
                container.js[window.azexo_baseurl + options.paths[i]] = true;
            }
            window.azexo_add_js_list(options);
        }
BaseElement.prototype.add_js=function(options) {
            var container = this.get_my_container();
            container.js[window.azexo_baseurl + options.path] = true;
            window.azexo_add_js(options);
        }
BaseElement.prototype.add_external_js=function(url, callback) {
            var container = this.get_my_container();
            container.js[url] = true;
            window.azexo_add_external_js(url, callback);
        }
BaseElement.prototype.get_my_container=function() {
            if (this instanceof ContainerElement) {
                return this;
            } else {
                return this.parent.get_my_container();
            }
        }
function register_element(base, is_container, Element) {
        extend(Element, BaseElement);
        Element.prototype.base = base;
        Element.prototype.is_container = is_container;
        BaseElement.prototype.elements[base] = Element;
        BaseElement.prototype.tags[base] = Element;
        if (is_container) {
            for (var i = 1; i < BaseElement.prototype.max_nested_depth; i++) {
                BaseElement.prototype.tags[base + '_' + i] = Element;
            }
        }
    }
function UnknownElement(parent, position) {
        UnknownElement.baseclass.apply(this, arguments);
    }
register_element('az_unknown', true, UnknownElement);
UnknownElement.prototype.has_content = true;
window.azexo_baseurl = 'http://cssi-dev.cabezonworks.com/sites/all/modules/azexo_composer/azexo_composer/';
window.ajaxurl = 'http://cssi-dev.cabezonworks.com/?q=azexo_composer_ajaxurl';
window.azexo_online = (window.location.protocol == 'http:' || window.location.protocol == 'https:');
var azexo_elements = new AZEXOElements();
var scroll_magic = null;
window.azexo_editor = false;
var azexo_containers = [];
var azexo_containers_loaded = {};
function connect_container(dom_element) {
        if ($(dom_element).length > 0) {
            var html = $(dom_element).html();
            var match = /^\s*\<[\s\S]*\>\s*$/.exec(html);
            if (match || (html == '' && 'ajaxurl' in window)) {
                $(dom_element).find('> script').detach().appendTo('head');
                $(dom_element).find('> link[href]').detach().appendTo('head');
                //$(dom_element).find('> script').remove();
                //$(dom_element).find('> link[href]').remove();
                var container = new ContainerElement(null, false);
                container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
                container.dom_element = $(dom_element);
                $(container.dom_element).attr('data-az-id', container.id);
                //container.dom_content_element = $(dom_element).closest_descendents('[data-azcnt]');
                container.dom_content_element = $(dom_element);
                $(container.dom_element).css('display', '');
                $(container.dom_element).addClass('azexo');
                $(container.dom_element).addClass('az-ctnr');
                container.parse_html(container.dom_content_element);
                container.html_content = true;
                container.loaded_container = container.attrs['container'];

                for (var i = 0; i < container.children.length; i++) {
                    container.children[i].recursive_render();
                }
                if (!azexo_frontend) {
                    container.dom_content_element.empty();
                    if (window.azexo_editor) {
                        container.show_controls();
                        container.update_sortable();
                    }
                    container.attach_children();
                }
                container.rendered = true;
                for (var i = 0; i < container.children.length; i++) {
                    container.children[i].recursive_showed();
                }
            } else {
                if (html.replace(/^\s+|\s+$/g, '') != '')
                    azexo_containers_loaded[$(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name')] = html.replace(/^\s+|\s+$/g, '');
                var container = new ContainerElement(null, false);
                container.attrs['container'] = $(dom_element).attr('data-az-type') + '/' + $(dom_element).attr('data-az-name');
                container.render($, p, fp);
                var classes = $(container.dom_element).attr('class') + ' ' + $(dom_element).attr('class');
                classes = $.unique(classes.split(' ')).join(' ');
                $(container.dom_element).attr('class', classes);
                $(container.dom_element).attr('style', $(dom_element).attr('style'));
                $(container.dom_element).css('display', '');
                $(container.dom_element).addClass('azexo');
                $(container.dom_element).addClass('az-ctnr');
                var type = $(dom_element).attr('data-az-type');
                var name = $(dom_element).attr('data-az-name');
                $(dom_element).replaceWith(container.dom_element);
                $(container.dom_element).attr('data-az-type', type);
                $(container.dom_element).attr('data-az-name', name);
                container.showed($, p, fp);
                if (window.azexo_editor)
                    container.show_controls();
            }
            if (window.azexo_editor) {
                $(container.dom_element).addClass('azexo-editor');
            }
            return container;
        }
        return null;
    }
function AnimatedElement(parent, position) {
        AnimatedElement.baseclass.apply(this, arguments);
    }
extend(AnimatedElement, BaseElement);
AnimatedElement.prototype.params=[{"param_name":"an_start","value":"","safe":true},{"param_name":"an_in","value":"","safe":true},{"param_name":"an_js_in","value":"","safe":true},{"param_name":"an_out","value":"","safe":true},{"param_name":"an_js_out","value":"","safe":true},{"param_name":"an_hidden","value":"","safe":true},{"param_name":"an_infinite","value":"","safe":true},{"param_name":"an_letters","value":"","safe":true},{"param_name":"an_duration","value":"1000","safe":true},{"param_name":"an_in_delay","value":"0","safe":true},{"param_name":"an_out_delay","value":"0","safe":true},{"param_name":"an_parent","value":"1","safe":true},{"param_name":"an_fill_mode","value":"","safe":true},{"param_name":"an_name","value":"","safe":true},{"param_name":"an_scenes","value":"","safe":true},{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true}];
AnimatedElement.prototype.render=function($, p, fp) {
            if ('an_name' in this.attrs && this.attrs['an_name'] != '') {
                $(this.dom_element).attr('data-an-name', this.attrs['an_name']);
            }
            AnimatedElement.baseclass.prototype.render.apply(this, arguments);
        }
function register_animated_element(base, is_container, Element) {
        extend(Element, AnimatedElement);
        Element.prototype.base = base;
        Element.prototype.is_container = is_container;
        AnimatedElement.prototype.elements[base] = Element;
        AnimatedElement.prototype.tags[base] = Element;
        if (is_container) {
            for (var i = 1; i < AnimatedElement.prototype.max_nested_depth; i++) {
                AnimatedElement.prototype.tags[base + '_' + i] = Element;
            }
        }
    }
function FormDataElement(parent, position) {
        FormDataElement.baseclass.apply(this, arguments);
    }
extend(FormDataElement, AnimatedElement);
FormDataElement.prototype.form_elements = {};
function register_form_data_element(base, Element) {
        extend(Element, FormDataElement);
        Element.prototype.base = base;
        FormDataElement.prototype.elements[base] = Element;
        FormDataElement.prototype.tags[base] = Element;
        FormDataElement.prototype.form_elements[base] = Element;
    }
function SectionElement(parent, position) {
        SectionElement.baseclass.apply(this, arguments);
    }
register_animated_element('az_section', true, SectionElement);
SectionElement.prototype.params=[{"param_name":"fluid","value":"","safe":true},{"param_name":"effect","value":"","safe":true},{"param_name":"parallax_speed","value":"","safe":true},{"param_name":"video_options","value":"","safe":true},{"param_name":"video_youtube","value":"","safe":true},{"param_name":"video_start","value":"0","safe":true},{"param_name":"video_stop","value":"0","safe":true},{"param_name":"an_start","value":"","safe":true},{"param_name":"an_in","value":"","safe":true},{"param_name":"an_js_in","value":"","safe":true},{"param_name":"an_out","value":"","safe":true},{"param_name":"an_js_out","value":"","safe":true},{"param_name":"an_hidden","value":"","safe":true},{"param_name":"an_infinite","value":"","safe":true},{"param_name":"an_letters","value":"","safe":true},{"param_name":"an_duration","value":"1000","safe":true},{"param_name":"an_in_delay","value":"0","safe":true},{"param_name":"an_out_delay","value":"0","safe":true},{"param_name":"an_parent","value":"1","safe":true},{"param_name":"an_fill_mode","value":"","safe":true},{"param_name":"an_name","value":"","safe":true},{"param_name":"an_scenes","value":"","safe":true},{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true},{"param_name":"menu_item_title","value":"","safe":true}];
SectionElement.prototype.showed=function($, p, fp) {
            SectionElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            switch (this.attrs['effect']) {
                case 'parallax':
                    this.add_js_list({
                        paths: ['jquery.parallax/jquery.parallax.js', 'jquery-waypoints/waypoints.min.js'],
                        loaded: 'waypoint' in $.fn && 'parallax' in $.fn,
                        callback: function() {
                            $(element.dom_element).waypoint(function(direction) {
                                $(element.dom_element).css('background-attachment', 'fixed');
                                $(element.dom_element).css('background-position', '50% 0');
                                $(element.dom_element).parallax("50%", element.attrs['parallax_speed'] / 100);
                            }, {offset: '100%', triggerOnce: true});
                            $(document).trigger('scroll');
                        }});
                    break;
                case 'fixed':
                    $(element.dom_element).css('background-attachment', 'fixed');
                    break;
                case 'youtube':
                    var loop = _.indexOf(element.attrs['video_options'].split(','), 'loop') >= 0;
                    var mute = _.indexOf(element.attrs['video_options'].split(','), 'mute') >= 0;
                    this.add_css('jquery.mb.YTPlayer/css/YTPlayer.css', 'mb_YTPlayer' in $.fn, function() {
                    });
                    this.add_js_list({
                        paths: ['jquery.mb.YTPlayer/inc/jquery.mb.YTPlayer.js', 'jquery-waypoints/waypoints.min.js'],
                        loaded: 'waypoint' in $.fn && 'mb_YTPlayer' in $.fn,
                        callback: function() {
                            $(element.dom_element).waypoint(function(direction) {
                                $(element.dom_element).attr('data-property', "{videoURL:'" + youtube_parser(element.attrs['video_youtube']) + "',containment:'#" + element.id + "', showControls:false, autoPlay:true, loop:" + loop.toString() + ", mute:" + mute.toString() + ", startAt:" + element.attrs['video_start'] + ", stopAt:" + element.attrs['video_stop'] + ", opacity:1, addRaster:false, quality:'default'}");
                                $(element.dom_element).mb_YTPlayer();
                                $(element.dom_element).playYTP();
                            }, {offset: '100%', triggerOnce: true});
                            $(document).trigger('scroll');
                        }});
                    break;
                default:
                    break;
            }
        }
function RowElement(parent, position) {
        RowElement.baseclass.apply(this, arguments);
        this.columns = '';
        if (!position || typeof position !== 'boolean') {
            this.set_columns('1/1');
        }
        this.attrs['device'] = 'sm';
    }
register_animated_element('az_row', true, RowElement);
RowElement.prototype.params=[{"param_name":"device","value":"","safe":true},{"param_name":"an_start","value":"","safe":true},{"param_name":"an_in","value":"","safe":true},{"param_name":"an_js_in","value":"","safe":true},{"param_name":"an_out","value":"","safe":true},{"param_name":"an_js_out","value":"","safe":true},{"param_name":"an_hidden","value":"","safe":true},{"param_name":"an_infinite","value":"","safe":true},{"param_name":"an_letters","value":"","safe":true},{"param_name":"an_duration","value":"1000","safe":true},{"param_name":"an_in_delay","value":"0","safe":true},{"param_name":"an_out_delay","value":"0","safe":true},{"param_name":"an_parent","value":"1","safe":true},{"param_name":"an_fill_mode","value":"","safe":true},{"param_name":"an_name","value":"","safe":true},{"param_name":"an_scenes","value":"","safe":true},{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true}];
RowElement.prototype.set_columns = function(columns){};
function ColumnElement(parent, position) {
        ColumnElement.baseclass.call(this, parent, position);
    }
register_element('az_column', true, ColumnElement);
ColumnElement.prototype.params=[{"param_name":"width","value":"","safe":true},{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true}];
function ContainerElement(parent, position) {
        ContainerElement.baseclass.apply(this, arguments);
        this.rendered = false;
        this.loaded_container = null;
        this.js = {};
        this.css = {};
    }
register_animated_element('az_container', true, ContainerElement);
ContainerElement.prototype.params=[{"param_name":"container","value":"/","safe":true},{"param_name":"an_start","value":"","safe":true},{"param_name":"an_in","value":"","safe":true},{"param_name":"an_js_in","value":"","safe":true},{"param_name":"an_out","value":"","safe":true},{"param_name":"an_js_out","value":"","safe":true},{"param_name":"an_hidden","value":"","safe":true},{"param_name":"an_infinite","value":"","safe":true},{"param_name":"an_letters","value":"","safe":true},{"param_name":"an_duration","value":"1000","safe":true},{"param_name":"an_in_delay","value":"0","safe":true},{"param_name":"an_out_delay","value":"0","safe":true},{"param_name":"an_parent","value":"1","safe":true},{"param_name":"an_fill_mode","value":"","safe":true},{"param_name":"an_name","value":"","safe":true},{"param_name":"an_scenes","value":"","safe":true},{"param_name":"el_class","value":"","safe":true},{"param_name":"style","value":"","safe":true},{"param_name":"hover_style","value":"","safe":true},{"param_name":"pos_left","value":"","safe":true},{"param_name":"pos_right","value":"","safe":true},{"param_name":"pos_top","value":"","safe":true},{"param_name":"pos_bottom","value":"","safe":true},{"param_name":"pos_width","value":"","safe":true},{"param_name":"pos_height","value":"","safe":true},{"param_name":"pos_zindex","value":"","safe":true}];
ContainerElement.prototype.showed=function($, p, fp) {
            ContainerElement.baseclass.prototype.showed.apply(this, arguments);
            var element = this;
            if (this.parent == null) {
                if (!element.rendered) {
                    element.rendered = true;
                    element.load_container();
                }
            } else {
                this.add_js({
                    path: 'jquery-waypoints/waypoints.min.js',
                    loaded: 'waypoint' in $.fn,
                    callback: function() {
                        $(element.dom_element).waypoint(function(direction) {
                            if (!element.rendered) {
                                element.rendered = true;
                                element.load_container();
                            }
                        }, {offset: '100%', triggerOnce: true});
                        $(document).trigger('scroll');
                    }});
            }
        }
ContainerElement.prototype.load_container=function() {
            var element = this;
            if (this.attrs['container'] != '') {
                azexo_load_container(this.attrs['container'].split('/')[0], this.attrs['container'].split('/')[1], function(shortcode) {
                    var match = /^\s*\<[\s\S]*\>\s*$/.exec(shortcode);
                    if (match) {
                        element.loaded_container = element.attrs['container'];
                        $(shortcode).appendTo(element.dom_content_element);
                        $(element.dom_content_element).find('> script').detach().appendTo('head');
                        $(element.dom_content_element).find('> link[href]').detach().appendTo('head');
                        $(element.dom_element).css('display', '');
                        $(element.dom_element).addClass('azexo');

                        element.parse_html(element.dom_content_element);
                        $(element.dom_element).attr('data-az-id', element.id);
                        element.html_content = true;
                        for (var i = 0; i < element.children.length; i++) {
                            element.children[i].recursive_render();
                        }
                        element.dom_content_element.empty();
                        if (window.azexo_editor) {
                            element.show_controls();
                            element.update_sortable();
                        }
                        element.attach_children();
                        for (var i = 0; i < element.children.length; i++) {
                            element.children[i].recursive_showed();
                        }
                        $(document).trigger('scroll');
                    } else {
                        if (!azexo_frontend) {
                            element.loaded_container = element.attrs['container'];
                            element.parse_shortcode(shortcode);

                            $(element.dom_element).attr('data-az-id', element.id);
                            if (window.azexo_editor) {
                                element.show_controls();
                                element.update_sortable();
                            }
                            for (var i = 0; i < element.children.length; i++) {
                                element.children[i].recursive_render();
                            }
                            element.attach_children();
                            if (element.parent != null) {
                                element.parent.update_dom();
                            }
                            for (var i = 0; i < element.children.length; i++) {
                                element.children[i].recursive_showed();
                            }
                            $(document).trigger('scroll');
                        }
                    }
                    azexo_elements.try_render_unknown_elements();
                    $(document).trigger('azexo_containers_update');
                });
            }
        }
ContainerElement.prototype.update_dom=function() {
            if (this.loaded_container != this.attrs['container']) {
                this.children = [];
                $(this.dom_content_element).empty();
                this.rendered = false;
                if (this.parent != null) {
                    ContainerElement.baseclass.prototype.update_dom.apply(this, arguments);
                }
            }
        }
ContainerElement.prototype.render=function($, p, fp) {
            this.dom_element = $('<div class="az-element az-container"><div class="az-ctnr"></div></div>');
            this.dom_content_element = $(this.dom_element).find('.az-ctnr');
            ContainerElement.baseclass.prototype.render.apply(this, arguments);
        }
ContainerElement.prototype.recursive_render=function() {
            if (azexo_frontend) {
                this.render($, p, fp);
                this.children = [];
            } else {
                ContainerElement.baseclass.prototype.recursive_render.apply(this, arguments);
            }
            if (window.azexo_editor) {
                this.show_controls();
                this.update_sortable();
            }
        }
window.azexo_elements = [];
window.azexo_elements.push({base: "az_text",
params: [{"param_name":"content","value":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},{"param_name":"an_start","value":""},{"param_name":"an_in","value":""},{"param_name":"an_js_in","value":""},{"param_name":"an_out","value":""},{"param_name":"an_js_out","value":""},{"param_name":"an_hidden","value":""},{"param_name":"an_infinite","value":""},{"param_name":"an_letters","value":""},{"param_name":"an_duration","value":"1000"},{"param_name":"an_in_delay","value":"0"},{"param_name":"an_out_delay","value":"0"},{"param_name":"an_parent","value":"1"},{"param_name":"an_fill_mode","value":""},{"param_name":"an_name","value":""},{"param_name":"an_scenes","value":""},{"param_name":"el_class","value":""},{"param_name":"style","value":""},{"param_name":"hover_style","value":""},{"param_name":"pos_left","value":""},{"param_name":"pos_right","value":""},{"param_name":"pos_top","value":""},{"param_name":"pos_bottom","value":""},{"param_name":"pos_width","value":""},{"param_name":"pos_height","value":""},{"param_name":"pos_zindex","value":""}],
is_container: true,
has_content: true,
});
window.azexo_form_elements = [];
function create_azexo_elements() {
        if ('azexo_elements' in window) {
            for (var i = 0; i < window.azexo_elements.length; i++) {
                var element = window.azexo_elements[i];
                var ExternalElement = function(parent, position) {
                    ExternalElement.baseclass.apply(this, arguments);
                }
                register_animated_element(element.base, element.is_container, ExternalElement);
                element.baseclass = ExternalElement.baseclass;
                element.params = element.params.concat(ExternalElement.prototype.params);
                mixin(ExternalElement.prototype, element);
                for (var j = 0; j < ExternalElement.prototype.params.length; j++) {
                    var param = ExternalElement.prototype.params[j];
                    var new_param = make_param_type(param);
                    ExternalElement.prototype.params[j] = new_param;
                }
            }
        }
    }
create_azexo_elements();
function create_azexo_form_elements() {
        if ('azexo_form_elements' in window) {
            for (var i = 0; i < window.azexo_form_elements.length; i++) {
                var element = window.azexo_form_elements[i];
                var ExternalElement = function(parent, position) {
                    ExternalElement.baseclass.apply(this, arguments);
                }
                register_form_data_element(element.base, ExternalElement);
                element.baseclass = ExternalElement.baseclass;
                element.params = element.params.concat(ExternalElement.prototype.params);
                mixin(ExternalElement.prototype, element);
                for (var j = 0; j < ExternalElement.prototype.params.length; j++) {
                    var param = ExternalElement.prototype.params[j];
                    var new_param = make_param_type(param);
                    ExternalElement.prototype.params[j] = new_param;
                }
            }
        }
    }
create_azexo_form_elements();
function make_azexo_extend() {
        if ('azexo_extend' in window) {
            for (var base in window.azexo_extend) {
                var element = window.azexo_extend[base];
                var params = [];
                if ('params' in element)
                    params = element.params;
                delete element.params;
                var reigstered_element = BaseElement.prototype.elements[base];
                if (!('extended' in reigstered_element)) {
                    reigstered_element.extended = true;
                    mixin(reigstered_element.prototype, element);
                    for (var i = 0; i < params.length; i++) {
                        var param = make_param_type(params[i]);
                        reigstered_element.prototype.params.push(param);
                    }
                }
            }
        }
    }
make_azexo_extend();
$(document).ready(function(){connect_container($('[data-az-hash="-617878365"]'));});
})(window.jQuery);
