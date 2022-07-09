
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false }) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\page1\Nav.svelte generated by Svelte v3.48.0 */

    const file$d = "src\\page1\\Nav.svelte";

    function create_fragment$d(ctx) {
    	let nav;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let ul;
    	let li0;
    	let t2;
    	let li1;
    	let t4;
    	let li2;
    	let t6;
    	let li3;
    	let t8;
    	let li4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "메인화면";
    			t2 = space();
    			li1 = element("li");
    			li1.textContent = "타이머 & 일정";
    			t4 = space();
    			li2 = element("li");
    			li2.textContent = "참가팀";
    			t6 = space();
    			li3 = element("li");
    			li3.textContent = "대회 안내";
    			t8 = space();
    			li4 = element("li");
    			li4.textContent = "카드뉴스";
    			if (!src_url_equal(img.src, img_src_value = "/logo.PNG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "로고");
    			attr_dev(img, "id", "nav_logo");
    			attr_dev(img, "class", "svelte-740b43");
    			add_location(img, file$d, 12, 8, 246);
    			attr_dev(div0, "id", "imageBox");
    			attr_dev(div0, "class", "svelte-740b43");
    			add_location(div0, file$d, 11, 4, 217);
    			attr_dev(li0, "class", "nav_item svelte-740b43");
    			add_location(li0, file$d, 16, 12, 375);
    			attr_dev(li1, "class", "nav_item svelte-740b43");
    			add_location(li1, file$d, 17, 12, 447);
    			attr_dev(li2, "class", "nav_item svelte-740b43");
    			add_location(li2, file$d, 18, 12, 525);
    			attr_dev(li3, "class", "nav_item svelte-740b43");
    			add_location(li3, file$d, 19, 12, 601);
    			attr_dev(li4, "class", "nav_item svelte-740b43");
    			add_location(li4, file$d, 20, 12, 682);
    			attr_dev(ul, "id", "nav_list");
    			attr_dev(ul, "class", "svelte-740b43");
    			add_location(ul, file$d, 15, 8, 343);
    			attr_dev(div1, "id", "nav_list_box");
    			attr_dev(div1, "class", "svelte-740b43");
    			add_location(div1, file$d, 14, 4, 310);
    			attr_dev(nav, "class", "svelte-740b43");
    			add_location(nav, file$d, 10, 0, 206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(div0, img);
    			append_dev(nav, t0);
    			append_dev(nav, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*scrollTo*/ ctx[0]("main"), false, false, false),
    					listen_dev(li1, "click", /*scrollTo*/ ctx[0]("#page2"), false, false, false),
    					listen_dev(li2, "click", /*scrollTo*/ ctx[0]("#teamlist"), false, false, false),
    					listen_dev(li3, "click", /*scrollTo*/ ctx[0]("#Information"), false, false, false),
    					listen_dev(li4, "click", /*scrollTo*/ ctx[0]("#page3contentBox"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);

    	const scrollTo = where => () => {
    		const el = document.querySelector(where);
    		el.scrollIntoView({ behavior: 'smooth' });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ scrollTo });
    	return [scrollTo];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\page1\Main.svelte generated by Svelte v3.48.0 */

    const file$c = "src\\page1\\Main.svelte";

    function create_fragment$c(ctx) {
    	let main;
    	let div4;
    	let div3;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let div2;
    	let div1;
    	let span;
    	let t5;
    	let div5;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "선린인터넷 고등학교 최대규모 대회";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Sunrinthon";
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "신청하기";
    			t5 = space();
    			div5 = element("div");
    			img0 = element("img");
    			t6 = space();
    			img1 = element("img");
    			attr_dev(p0, "class", "sc5 cream svelte-1enbxlj");
    			add_location(p0, file$c, 10, 16, 243);
    			attr_dev(p1, "class", "sc7 cream svelte-1enbxlj");
    			add_location(p1, file$c, 11, 16, 304);
    			attr_dev(div0, "id", "textBox");
    			attr_dev(div0, "class", "svelte-1enbxlj");
    			add_location(div0, file$c, 9, 12, 207);
    			attr_dev(span, "class", "sc7 svelte-1enbxlj");
    			add_location(span, file$c, 15, 20, 470);
    			attr_dev(div1, "id", "linkBox");
    			attr_dev(div1, "class", "svelte-1enbxlj");
    			add_location(div1, file$c, 14, 16, 408);
    			attr_dev(div2, "id", "assign");
    			attr_dev(div2, "class", "svelte-1enbxlj");
    			add_location(div2, file$c, 13, 12, 373);
    			attr_dev(div3, "id", "content1Box");
    			attr_dev(div3, "class", "svelte-1enbxlj");
    			add_location(div3, file$c, 8, 8, 171);
    			attr_dev(div4, "id", "page1_cont1");
    			attr_dev(div4, "class", "svelte-1enbxlj");
    			add_location(div4, file$c, 7, 4, 139);
    			if (!src_url_equal(img0.src, img0_src_value = "/textBubble.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "선린 인터넷");
    			attr_dev(img0, "id", "textBubble");
    			attr_dev(img0, "class", "svelte-1enbxlj");
    			add_location(img0, file$c, 21, 8, 609);
    			if (!src_url_equal(img1.src, img1_src_value = "/cursor.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "커서 ");
    			attr_dev(img1, "id", "handCursor");
    			attr_dev(img1, "class", "svelte-1enbxlj");
    			add_location(img1, file$c, 22, 8, 677);
    			attr_dev(div5, "id", "page1_cont2");
    			attr_dev(div5, "class", "svelte-1enbxlj");
    			add_location(div5, file$c, 20, 4, 577);
    			attr_dev(main, "class", "svelte-1enbxlj");
    			add_location(main, file$c, 6, 0, 127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(main, t5);
    			append_dev(main, div5);
    			append_dev(div5, img0);
    			append_dev(div5, t6);
    			append_dev(div5, img1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*openLink*/ ctx[0](), false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);

    	const openLink = () => () => {
    		window.open("https://bit.ly/8th_sunrinthon_tryout");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ openLink });
    	return [openLink];
    }

    class Main$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\page1\Seperator.svelte generated by Svelte v3.48.0 */

    const file$b = "src\\page1\\Seperator.svelte";

    function create_fragment$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svelte-qbtjbb");
    			add_location(div, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Seperator', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Seperator> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Seperator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Seperator",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\Page1.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\Page1.svelte";

    function create_fragment$a(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let nav;
    	let t0;
    	let main;
    	let t1;
    	let div2;
    	let div1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let seperator;
    	let current;
    	nav = new Nav({ $$inline: true });
    	main = new Main$1({ $$inline: true });
    	seperator = new Seperator({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(main.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "●";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Scroll down";
    			t5 = space();
    			create_component(seperator.$$.fragment);
    			attr_dev(div0, "id", "contentContainer");
    			attr_dev(div0, "class", "svelte-1p3fkh7");
    			add_location(div0, file$a, 8, 8, 225);
    			attr_dev(p0, "class", "sc4");
    			add_location(p0, file$a, 15, 16, 407);
    			add_location(p1, file$a, 16, 16, 445);
    			add_location(div1, file$a, 14, 12, 384);
    			attr_dev(div2, "id", "scrollDown");
    			attr_dev(div2, "class", "sc6 cream svelte-1p3fkh7");
    			add_location(div2, file$a, 13, 8, 331);
    			attr_dev(div3, "id", "page");
    			attr_dev(div3, "class", "grid svelte-1p3fkh7");
    			add_location(div3, file$a, 7, 4, 187);
    			attr_dev(div4, "id", "full");
    			attr_dev(div4, "class", "svelte-1p3fkh7");
    			add_location(div4, file$a, 6, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			mount_component(nav, div0, null);
    			append_dev(div0, t0);
    			mount_component(main, div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(div4, t5);
    			mount_component(seperator, div4, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			transition_in(seperator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			transition_out(seperator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(nav);
    			destroy_component(main);
    			destroy_component(seperator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page1', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Nav, Main: Main$1, Seperator });
    	return [];
    }

    class Page1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page1",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\page2\Timer.svelte generated by Svelte v3.48.0 */

    const file$9 = "src\\page2\\Timer.svelte";

    function create_fragment$9(ctx) {
    	let div3;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let div2;
    	let div1;
    	let p2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "타이머 및 일정표";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "예선 마감 까지";
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			p2 = element("p");
    			p2.textContent = "00:00:00";
    			attr_dev(p0, "class", "sc8 svelte-i78ert");
    			add_location(p0, file$9, 6, 8, 78);
    			attr_dev(p1, "class", "sc7 bluegreen svelte-i78ert");
    			add_location(p1, file$9, 7, 8, 116);
    			attr_dev(div0, "id", "textBox");
    			attr_dev(div0, "class", "svelte-i78ert");
    			add_location(div0, file$9, 5, 4, 50);
    			attr_dev(p2, "id", "timeText");
    			attr_dev(p2, "class", "sc7 cream svelte-i78ert");
    			add_location(p2, file$9, 11, 12, 238);
    			attr_dev(div1, "id", "speechBubble");
    			attr_dev(div1, "class", "svelte-i78ert");
    			add_location(div1, file$9, 10, 8, 201);
    			attr_dev(div2, "id", "bubbleBox");
    			attr_dev(div2, "class", "svelte-i78ert");
    			add_location(div2, file$9, 9, 4, 171);
    			attr_dev(div3, "id", "timerBox");
    			attr_dev(div3, "class", "svelte-i78ert");
    			add_location(div3, file$9, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Timer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timer",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\page2\Schedule.svelte generated by Svelte v3.48.0 */

    const file$8 = "src\\page2\\Schedule.svelte";

    function create_fragment$8(ctx) {
    	let div16;
    	let div12;
    	let div1;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let object0;
    	let t5;
    	let div3;
    	let div2;
    	let p2;
    	let t7;
    	let p3;
    	let t9;
    	let object1;
    	let t11;
    	let div5;
    	let div4;
    	let p4;
    	let t13;
    	let p5;
    	let t15;
    	let object2;
    	let t17;
    	let div7;
    	let div6;
    	let p6;
    	let t19;
    	let p7;
    	let t21;
    	let object3;
    	let t23;
    	let div9;
    	let div8;
    	let p8;
    	let t25;
    	let p9;
    	let t27;
    	let object4;
    	let t29;
    	let div11;
    	let div10;
    	let p10;
    	let t31;
    	let p11;
    	let t33;
    	let object5;
    	let t35;
    	let div15;
    	let div13;
    	let t36;
    	let div14;
    	let span0;
    	let t38;
    	let span1;
    	let t39;
    	let t40;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div12 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "본선 시작";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = `${/*MissionTimeLine*/ ctx[1][0]}`;
    			t3 = space();
    			object0 = element("object");
    			object0.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "미션 1";
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = `${/*MissionTimeLine*/ ctx[1][1]}`;
    			t9 = space();
    			object1 = element("object");
    			object1.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p4 = element("p");
    			p4.textContent = "레크레이션";
    			t13 = space();
    			p5 = element("p");
    			p5.textContent = `${/*MissionTimeLine*/ ctx[1][2]}`;
    			t15 = space();
    			object2 = element("object");
    			object2.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t17 = space();
    			div7 = element("div");
    			div6 = element("div");
    			p6 = element("p");
    			p6.textContent = "멘토링";
    			t19 = space();
    			p7 = element("p");
    			p7.textContent = `${/*MissionTimeLine*/ ctx[1][3]}`;
    			t21 = space();
    			object3 = element("object");
    			object3.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t23 = space();
    			div9 = element("div");
    			div8 = element("div");
    			p8 = element("p");
    			p8.textContent = "스텝 대전";
    			t25 = space();
    			p9 = element("p");
    			p9.textContent = `${/*MissionTimeLine*/ ctx[1][4]}`;
    			t27 = space();
    			object4 = element("object");
    			object4.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t29 = space();
    			div11 = element("div");
    			div10 = element("div");
    			p10 = element("p");
    			p10.textContent = "미션 2";
    			t31 = space();
    			p11 = element("p");
    			p11.textContent = `${/*MissionTimeLine*/ ctx[1][5]}`;
    			t33 = space();
    			object5 = element("object");
    			object5.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t35 = space();
    			div15 = element("div");
    			div13 = element("div");
    			t36 = space();
    			div14 = element("div");
    			span0 = element("span");
    			span0.textContent = "* 아이콘을 클릭하여 정보를 볼 수 있습니다";
    			t38 = space();
    			span1 = element("span");
    			t39 = text("현재 시각 : ");
    			t40 = text(/*formatedNow*/ ctx[0]);
    			attr_dev(p0, "class", "sc8");
    			add_location(p0, file$8, 17, 16, 349);
    			attr_dev(p1, "class", "sc5");
    			add_location(p1, file$8, 18, 16, 391);
    			attr_dev(div0, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div0, file$8, 16, 12, 302);
    			attr_dev(object0, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object0, "type", "image/svg+xml");
    			attr_dev(object0, "data", "/svgs/markerIcon.svg");
    			attr_dev(object0, "title", "marker");
    			add_location(object0, file$8, 20, 12, 464);
    			attr_dev(div1, "class", "MarkerBox svelte-1un34ud");
    			add_location(div1, file$8, 15, 8, 265);
    			attr_dev(p2, "class", "sc8");
    			add_location(p2, file$8, 24, 16, 695);
    			attr_dev(p3, "class", "sc5");
    			add_location(p3, file$8, 25, 16, 736);
    			attr_dev(div2, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div2, file$8, 23, 12, 648);
    			attr_dev(object1, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object1, "type", "image/svg+xml");
    			attr_dev(object1, "data", "/svgs/markerIcon.svg");
    			attr_dev(object1, "title", "marker");
    			add_location(object1, file$8, 27, 12, 809);
    			attr_dev(div3, "class", "MarkerBox svelte-1un34ud");
    			add_location(div3, file$8, 22, 8, 611);
    			attr_dev(p4, "class", "sc8");
    			add_location(p4, file$8, 31, 16, 1039);
    			attr_dev(p5, "class", "sc5");
    			add_location(p5, file$8, 32, 16, 1081);
    			attr_dev(div4, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div4, file$8, 30, 12, 992);
    			attr_dev(object2, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object2, "type", "image/svg+xml");
    			attr_dev(object2, "data", "/svgs/markerIcon.svg");
    			attr_dev(object2, "title", "marker");
    			add_location(object2, file$8, 34, 12, 1154);
    			attr_dev(div5, "class", "MarkerBox svelte-1un34ud");
    			add_location(div5, file$8, 29, 8, 955);
    			attr_dev(p6, "class", "sc8");
    			add_location(p6, file$8, 38, 16, 1384);
    			attr_dev(p7, "class", "sc5");
    			add_location(p7, file$8, 39, 16, 1424);
    			attr_dev(div6, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div6, file$8, 37, 12, 1337);
    			attr_dev(object3, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object3, "type", "image/svg+xml");
    			attr_dev(object3, "data", "/svgs/markerIcon.svg");
    			attr_dev(object3, "title", "marker");
    			add_location(object3, file$8, 41, 12, 1497);
    			attr_dev(div7, "class", "MarkerBox svelte-1un34ud");
    			add_location(div7, file$8, 36, 8, 1300);
    			attr_dev(p8, "class", "sc8");
    			add_location(p8, file$8, 45, 16, 1727);
    			attr_dev(p9, "class", "sc5");
    			add_location(p9, file$8, 46, 16, 1769);
    			attr_dev(div8, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div8, file$8, 44, 12, 1680);
    			attr_dev(object4, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object4, "type", "image/svg+xml");
    			attr_dev(object4, "data", "/svgs/markerIcon.svg");
    			attr_dev(object4, "title", "marker");
    			add_location(object4, file$8, 48, 12, 1842);
    			attr_dev(div9, "class", "MarkerBox svelte-1un34ud");
    			add_location(div9, file$8, 43, 8, 1643);
    			attr_dev(p10, "class", "sc8");
    			add_location(p10, file$8, 52, 16, 2072);
    			attr_dev(p11, "class", "sc5");
    			add_location(p11, file$8, 53, 16, 2113);
    			attr_dev(div10, "class", "ScheduleTextBox svelte-1un34ud");
    			add_location(div10, file$8, 51, 12, 2025);
    			attr_dev(object5, "class", "markerSvg svelte-1un34ud");
    			attr_dev(object5, "type", "image/svg+xml");
    			attr_dev(object5, "data", "/svgs/markerIcon.svg");
    			attr_dev(object5, "title", "marker");
    			add_location(object5, file$8, 55, 12, 2187);
    			attr_dev(div11, "class", "MarkerBox svelte-1un34ud");
    			add_location(div11, file$8, 50, 8, 1988);
    			attr_dev(div12, "id", "progressBarDescription");
    			attr_dev(div12, "class", "svelte-1un34ud");
    			add_location(div12, file$8, 14, 4, 222);
    			attr_dev(div13, "id", "progressBar");
    			attr_dev(div13, "class", "svelte-1un34ud");
    			add_location(div13, file$8, 59, 8, 2376);
    			attr_dev(span0, "class", "sc5 bluegreen");
    			add_location(span0, file$8, 61, 12, 2446);
    			attr_dev(span1, "class", "sc7 bluegreen");
    			add_location(span1, file$8, 62, 12, 2519);
    			attr_dev(div14, "id", "description");
    			attr_dev(div14, "class", "svelte-1un34ud");
    			add_location(div14, file$8, 60, 8, 2410);
    			attr_dev(div15, "id", "barDescription");
    			attr_dev(div15, "class", "svelte-1un34ud");
    			add_location(div15, file$8, 58, 4, 2341);
    			add_location(div16, file$8, 13, 0, 211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div12);
    			append_dev(div12, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div1, t3);
    			append_dev(div1, object0);
    			append_dev(div12, t5);
    			append_dev(div12, div3);
    			append_dev(div3, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t7);
    			append_dev(div2, p3);
    			append_dev(div3, t9);
    			append_dev(div3, object1);
    			append_dev(div12, t11);
    			append_dev(div12, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p4);
    			append_dev(div4, t13);
    			append_dev(div4, p5);
    			append_dev(div5, t15);
    			append_dev(div5, object2);
    			append_dev(div12, t17);
    			append_dev(div12, div7);
    			append_dev(div7, div6);
    			append_dev(div6, p6);
    			append_dev(div6, t19);
    			append_dev(div6, p7);
    			append_dev(div7, t21);
    			append_dev(div7, object3);
    			append_dev(div12, t23);
    			append_dev(div12, div9);
    			append_dev(div9, div8);
    			append_dev(div8, p8);
    			append_dev(div8, t25);
    			append_dev(div8, p9);
    			append_dev(div9, t27);
    			append_dev(div9, object4);
    			append_dev(div12, t29);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, p10);
    			append_dev(div10, t31);
    			append_dev(div10, p11);
    			append_dev(div11, t33);
    			append_dev(div11, object5);
    			append_dev(div16, t35);
    			append_dev(div16, div15);
    			append_dev(div15, div13);
    			append_dev(div15, t36);
    			append_dev(div15, div14);
    			append_dev(div14, span0);
    			append_dev(div14, t38);
    			append_dev(div14, span1);
    			append_dev(span1, t39);
    			append_dev(span1, t40);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formatedNow*/ 1) set_data_dev(t40, /*formatedNow*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Schedule', slots, []);
    	let { formatedNow } = $$props;
    	const MissionTimeLine = ["00 : 00", "00 : 00", "00 : 00", "00 : 00", "00 : 00", "00 : 00"];
    	const writable_props = ['formatedNow'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Schedule> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('formatedNow' in $$props) $$invalidate(0, formatedNow = $$props.formatedNow);
    	};

    	$$self.$capture_state = () => ({ formatedNow, MissionTimeLine });

    	$$self.$inject_state = $$props => {
    		if ('formatedNow' in $$props) $$invalidate(0, formatedNow = $$props.formatedNow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [formatedNow, MissionTimeLine];
    }

    class Schedule extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { formatedNow: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Schedule",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*formatedNow*/ ctx[0] === undefined && !('formatedNow' in props)) {
    			console.warn("<Schedule> was created without expected prop 'formatedNow'");
    		}
    	}

    	get formatedNow() {
    		throw new Error("<Schedule>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatedNow(value) {
    		throw new Error("<Schedule>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Page2.svelte generated by Svelte v3.48.0 */
    const file$7 = "src\\Page2.svelte";

    function create_fragment$7(ctx) {
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let div2;
    	let timer;
    	let current;

    	timer = new Timer({
    			props: {
    				formatedRemaining: /*handleUndefined*/ ctx[1](/*formatedRemaining*/ ctx[0])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Timer & Schedule";
    			t1 = space();
    			div2 = element("div");
    			create_component(timer.$$.fragment);
    			attr_dev(p, "class", "sc5 svelte-2z319y");
    			add_location(p, file$7, 39, 28, 1384);
    			attr_dev(div0, "id", "title");
    			attr_dev(div0, "class", "svelte-2z319y");
    			add_location(div0, file$7, 39, 12, 1368);
    			add_location(div1, file$7, 38, 8, 1349);
    			attr_dev(div2, "id", "components");
    			attr_dev(div2, "class", "svelte-2z319y");
    			add_location(div2, file$7, 41, 8, 1451);
    			attr_dev(div3, "id", "contentBox");
    			attr_dev(div3, "class", "svelte-2z319y");
    			add_location(div3, file$7, 37, 4, 1318);
    			attr_dev(div4, "id", "page2");
    			attr_dev(div4, "class", "grid svelte-2z319y");
    			add_location(div4, file$7, 36, 0, 1283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			mount_component(timer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const timer_changes = {};
    			if (dirty & /*formatedRemaining*/ 1) timer_changes.formatedRemaining = /*handleUndefined*/ ctx[1](/*formatedRemaining*/ ctx[0]);
    			timer.$set(timer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(timer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page2', slots, []);
    	const handleUndefined = variable => variable || '00:00:00';
    	const qualificationDue = new Date("6/19/22");
    	const today = new Date('6/5/22');
    	let hour, min, sec;
    	let nowH, nowM, nowS;
    	let formatedRemaining;
    	let formatedNow;

    	const time = setInterval(
    		() => {
    			let now = Date.now() - today + 1000;
    			let remaining = qualificationDue - Date.now();
    			hour = Math.floor(remaining / 1000 / 60 / 60);
    			remaining -= hour * 1000 * 60 * 60;
    			min = Math.floor(remaining / 1000 / 60);
    			remaining -= min * 1000 * 60;
    			sec = Math.floor(remaining / 1000);
    			nowH = Math.floor(now / 1000 / 60 / 60);
    			now -= nowH * 1000 * 60 * 60;
    			nowM = Math.floor(now / 1000 / 60);
    			now -= nowM * 1000 * 60;
    			nowS = Math.floor(now / 1000);
    			nowH = nowH % 24;
    			$$invalidate(0, formatedRemaining = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
    			formatedNow = `${nowH.toString().padStart(2, '0')}:${nowM.toString().padStart(2, '0')}:${nowS.toString().padStart(2, '0')}`;
    		},
    		1000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Timer,
    		Schedule,
    		handleUndefined,
    		qualificationDue,
    		today,
    		hour,
    		min,
    		sec,
    		nowH,
    		nowM,
    		nowS,
    		formatedRemaining,
    		formatedNow,
    		time
    	});

    	$$self.$inject_state = $$props => {
    		if ('hour' in $$props) hour = $$props.hour;
    		if ('min' in $$props) min = $$props.min;
    		if ('sec' in $$props) sec = $$props.sec;
    		if ('nowH' in $$props) nowH = $$props.nowH;
    		if ('nowM' in $$props) nowM = $$props.nowM;
    		if ('nowS' in $$props) nowS = $$props.nowS;
    		if ('formatedRemaining' in $$props) $$invalidate(0, formatedRemaining = $$props.formatedRemaining);
    		if ('formatedNow' in $$props) formatedNow = $$props.formatedNow;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [formatedRemaining, handleUndefined];
    }

    class Page2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page2",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\page3\Info.svelte generated by Svelte v3.48.0 */

    const file$6 = "src\\page3\\Info.svelte";

    function create_fragment$6(ctx) {
    	let div20;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let div19;
    	let div3;
    	let div1;
    	let object0;
    	let t5;
    	let div2;
    	let p2;
    	let t7;
    	let div6;
    	let div4;
    	let object1;
    	let t9;
    	let div5;
    	let p3;
    	let t11;
    	let div9;
    	let div7;
    	let object2;
    	let t13;
    	let div8;
    	let p4;
    	let t15;
    	let div12;
    	let div10;
    	let object3;
    	let t17;
    	let div11;
    	let p5;
    	let t19;
    	let div15;
    	let div13;
    	let object4;
    	let t21;
    	let div14;
    	let p6;
    	let t23;
    	let div18;
    	let div16;
    	let object5;
    	let t25;
    	let div17;
    	let p7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "2022 8th Sunrinthon Information";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "2022 8th 선린톤 안내";
    			t3 = space();
    			div19 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			object0 = element("object");
    			object0.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t5 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "선린 해커톤?";
    			t7 = space();
    			div6 = element("div");
    			div4 = element("div");
    			object1 = element("object");
    			object1.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t9 = space();
    			div5 = element("div");
    			p3 = element("p");
    			p3.textContent = "오프라인 안내";
    			t11 = space();
    			div9 = element("div");
    			div7 = element("div");
    			object2 = element("object");
    			object2.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t13 = space();
    			div8 = element("div");
    			p4 = element("p");
    			p4.textContent = "본선 관련 안내";
    			t15 = space();
    			div12 = element("div");
    			div10 = element("div");
    			object3 = element("object");
    			object3.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t17 = space();
    			div11 = element("div");
    			p5 = element("p");
    			p5.textContent = "예선 관련 안내";
    			t19 = space();
    			div15 = element("div");
    			div13 = element("div");
    			object4 = element("object");
    			object4.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t21 = space();
    			div14 = element("div");
    			p6 = element("p");
    			p6.textContent = "문의 / SNS";
    			t23 = space();
    			div18 = element("div");
    			div16 = element("div");
    			object5 = element("object");
    			object5.textContent = "이 브라우저는 svg를 지원하지않습니다.";
    			t25 = space();
    			div17 = element("div");
    			p7 = element("p");
    			p7.textContent = "심사기준";
    			attr_dev(p0, "class", "sc5 grey svelte-6nnxpn");
    			add_location(p0, file$6, 20, 8, 446);
    			attr_dev(p1, "class", "sc8 black svelte-6nnxpn");
    			add_location(p1, file$6, 21, 8, 511);
    			attr_dev(div0, "id", "InfoTextBox");
    			attr_dev(div0, "class", "svelte-6nnxpn");
    			add_location(div0, file$6, 19, 4, 414);
    			attr_dev(object0, "data", "/svgs/whatsHackathon.svg");
    			attr_dev(object0, "type", "image/svg+xml");
    			attr_dev(object0, "title", "whatsHackathon");
    			attr_dev(object0, "class", "svelte-6nnxpn");
    			add_location(object0, file$6, 26, 16, 710);
    			attr_dev(div1, "class", "svgContainer svelte-6nnxpn");
    			add_location(div1, file$6, 25, 12, 666);
    			attr_dev(p2, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p2, file$6, 34, 16, 1005);
    			attr_dev(div2, "class", "sectionText svelte-6nnxpn");
    			add_location(div2, file$6, 33, 12, 962);
    			attr_dev(div3, "class", "section svelte-6nnxpn");
    			add_location(div3, file$6, 24, 8, 601);
    			attr_dev(object1, "data", "/svgs/offlineInfo.svg");
    			attr_dev(object1, "type", "image/svg+xml");
    			attr_dev(object1, "title", "offlineInfo");
    			attr_dev(object1, "class", "svelte-6nnxpn");
    			add_location(object1, file$6, 39, 16, 1195);
    			attr_dev(div4, "class", "svgContainer svelte-6nnxpn");
    			add_location(div4, file$6, 38, 12, 1151);
    			attr_dev(p3, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p3, file$6, 47, 16, 1484);
    			attr_dev(div5, "class", "sectionText svelte-6nnxpn");
    			add_location(div5, file$6, 46, 12, 1441);
    			attr_dev(div6, "class", "section svelte-6nnxpn");
    			add_location(div6, file$6, 37, 8, 1086);
    			attr_dev(object2, "data", "/svgs/finalInfo.svg");
    			attr_dev(object2, "type", "image/svg+xml");
    			attr_dev(object2, "title", "finalInfo");
    			attr_dev(object2, "class", "svelte-6nnxpn");
    			add_location(object2, file$6, 52, 16, 1674);
    			attr_dev(div7, "class", "svgContainer svelte-6nnxpn");
    			add_location(div7, file$6, 51, 12, 1630);
    			attr_dev(p4, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p4, file$6, 60, 16, 1959);
    			attr_dev(div8, "class", "sectionText svelte-6nnxpn");
    			add_location(div8, file$6, 59, 12, 1916);
    			attr_dev(div9, "class", "section svelte-6nnxpn");
    			add_location(div9, file$6, 50, 8, 1565);
    			attr_dev(object3, "data", "/svgs/qualificationInfo.svg");
    			attr_dev(object3, "type", "image/svg+xml");
    			attr_dev(object3, "title", "qualificationInfo");
    			attr_dev(object3, "class", "svelte-6nnxpn");
    			add_location(object3, file$6, 65, 16, 2150);
    			attr_dev(div10, "class", "svgContainer svelte-6nnxpn");
    			add_location(div10, file$6, 64, 12, 2106);
    			attr_dev(p5, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p5, file$6, 73, 16, 2451);
    			attr_dev(div11, "class", "sectionText svelte-6nnxpn");
    			add_location(div11, file$6, 72, 12, 2408);
    			attr_dev(div12, "class", "section svelte-6nnxpn");
    			add_location(div12, file$6, 63, 8, 2041);
    			attr_dev(object4, "data", "/svgs/questionSNS.svg");
    			attr_dev(object4, "type", "image/svg+xml");
    			attr_dev(object4, "title", "offlineInfo");
    			attr_dev(object4, "class", "svelte-6nnxpn");
    			add_location(object4, file$6, 78, 16, 2642);
    			attr_dev(div13, "class", "svgContainer svelte-6nnxpn");
    			add_location(div13, file$6, 77, 12, 2598);
    			attr_dev(p6, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p6, file$6, 86, 16, 2931);
    			attr_dev(div14, "class", "sectionText svelte-6nnxpn");
    			add_location(div14, file$6, 85, 12, 2888);
    			attr_dev(div15, "class", "section svelte-6nnxpn");
    			add_location(div15, file$6, 76, 8, 2533);
    			attr_dev(object5, "data", "/svgs/guideline.svg");
    			attr_dev(object5, "type", "image/svg+xml");
    			attr_dev(object5, "title", "guidline");
    			attr_dev(object5, "class", "svelte-6nnxpn");
    			add_location(object5, file$6, 91, 16, 3122);
    			attr_dev(div16, "class", "svgContainer svelte-6nnxpn");
    			add_location(div16, file$6, 90, 12, 3078);
    			attr_dev(p7, "class", "sc7 sectionP svelte-6nnxpn");
    			add_location(p7, file$6, 99, 16, 3406);
    			attr_dev(div17, "class", "sectionText svelte-6nnxpn");
    			add_location(div17, file$6, 98, 12, 3363);
    			attr_dev(div18, "class", "section svelte-6nnxpn");
    			add_location(div18, file$6, 89, 8, 3013);
    			attr_dev(div19, "id", "sectionsBox");
    			attr_dev(div19, "class", "svelte-6nnxpn");
    			add_location(div19, file$6, 23, 4, 569);
    			attr_dev(div20, "id", "Information");
    			attr_dev(div20, "class", "svelte-6nnxpn");
    			add_location(div20, file$6, 18, 0, 386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div20, t3);
    			append_dev(div20, div19);
    			append_dev(div19, div3);
    			append_dev(div3, div1);
    			append_dev(div1, object0);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, p2);
    			append_dev(div19, t7);
    			append_dev(div19, div6);
    			append_dev(div6, div4);
    			append_dev(div4, object1);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, p3);
    			append_dev(div19, t11);
    			append_dev(div19, div9);
    			append_dev(div9, div7);
    			append_dev(div7, object2);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, p4);
    			append_dev(div19, t15);
    			append_dev(div19, div12);
    			append_dev(div12, div10);
    			append_dev(div10, object3);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, p5);
    			append_dev(div19, t19);
    			append_dev(div19, div15);
    			append_dev(div15, div13);
    			append_dev(div13, object4);
    			append_dev(div15, t21);
    			append_dev(div15, div14);
    			append_dev(div14, p6);
    			append_dev(div19, t23);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			append_dev(div16, object5);
    			append_dev(div18, t25);
    			append_dev(div18, div17);
    			append_dev(div17, p7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "click", /*changeSelection*/ ctx[0](1), false, false, false),
    					listen_dev(div6, "click", /*changeSelection*/ ctx[0](2), false, false, false),
    					listen_dev(div9, "click", /*changeSelection*/ ctx[0](3), false, false, false),
    					listen_dev(div12, "click", /*changeSelection*/ ctx[0](4), false, false, false),
    					listen_dev(div15, "click", /*changeSelection*/ ctx[0](5), false, false, false),
    					listen_dev(div18, "click", /*changeSelection*/ ctx[0](6), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	let { select = 1, isOpen = false } = $$props;
    	let checkSame;

    	const changeSelection = num => () => {
    		if (checkSame == num) {
    			checkSame = null;
    			$$invalidate(1, select = num);
    			$$invalidate(2, isOpen = false);
    		} else {
    			$$invalidate(2, isOpen = true);
    			$$invalidate(1, select = num);
    			checkSame = num;
    		}
    	};

    	const writable_props = ['select', 'isOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('select' in $$props) $$invalidate(1, select = $$props.select);
    		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
    	};

    	$$self.$capture_state = () => ({
    		select,
    		isOpen,
    		checkSame,
    		changeSelection
    	});

    	$$self.$inject_state = $$props => {
    		if ('select' in $$props) $$invalidate(1, select = $$props.select);
    		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
    		if ('checkSame' in $$props) checkSame = $$props.checkSame;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [changeSelection, select, isOpen];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { select: 1, isOpen: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get select() {
    		throw new Error("<Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\page3\CardNews.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\page3\\CardNews.svelte";

    function create_fragment$5(ctx) {
    	let div10;
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let div1;
    	let p1;
    	let t3;
    	let div9;
    	let div8;
    	let div3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div4;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let div6;
    	let img3;
    	let img3_src_value;
    	let t7;
    	let div7;
    	let img4;
    	let img4_src_value;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Card News";
    			t1 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "카드 뉴스";
    			t3 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div3 = element("div");
    			img0 = element("img");
    			t4 = space();
    			div4 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div5 = element("div");
    			img2 = element("img");
    			t6 = space();
    			div6 = element("div");
    			img3 = element("img");
    			t7 = space();
    			div7 = element("div");
    			img4 = element("img");
    			attr_dev(p0, "class", "sc5 svelte-1ab9e9l");
    			add_location(p0, file$5, 40, 24, 934);
    			attr_dev(div0, "id", "title");
    			attr_dev(div0, "class", "svelte-1ab9e9l");
    			add_location(div0, file$5, 40, 8, 918);
    			attr_dev(p1, "class", "sc8 svelte-1ab9e9l");
    			add_location(p1, file$5, 41, 27, 997);
    			attr_dev(div1, "id", "kr-title");
    			attr_dev(div1, "class", "svelte-1ab9e9l");
    			add_location(div1, file$5, 41, 8, 978);
    			attr_dev(div2, "id", "cardNewsTextBox");
    			attr_dev(div2, "class", "svelte-1ab9e9l");
    			add_location(div2, file$5, 39, 4, 882);
    			if (!src_url_equal(img0.src, img0_src_value = "./cards/card1.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "카드뉴스");
    			attr_dev(img0, "class", "svelte-1ab9e9l");
    			add_location(img0, file$5, 47, 16, 1180);
    			attr_dev(div3, "class", "slide svelte-1ab9e9l");
    			add_location(div3, file$5, 46, 12, 1143);
    			if (!src_url_equal(img1.src, img1_src_value = "/cards/card2.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "카드뉴스");
    			attr_dev(img1, "class", "svelte-1ab9e9l");
    			add_location(img1, file$5, 50, 16, 1293);
    			attr_dev(div4, "class", "slide svelte-1ab9e9l");
    			add_location(div4, file$5, 49, 12, 1256);
    			if (!src_url_equal(img2.src, img2_src_value = "/cards/card3.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "카드뉴스");
    			attr_dev(img2, "class", "svelte-1ab9e9l");
    			add_location(img2, file$5, 53, 16, 1405);
    			attr_dev(div5, "class", "slide svelte-1ab9e9l");
    			add_location(div5, file$5, 52, 12, 1368);
    			if (!src_url_equal(img3.src, img3_src_value = "/cards/card4.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "카드뉴스");
    			attr_dev(img3, "class", "svelte-1ab9e9l");
    			add_location(img3, file$5, 56, 16, 1517);
    			attr_dev(div6, "class", "slide svelte-1ab9e9l");
    			add_location(div6, file$5, 55, 12, 1480);
    			if (!src_url_equal(img4.src, img4_src_value = "/cards/card5.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "카드뉴스");
    			attr_dev(img4, "class", "svelte-1ab9e9l");
    			add_location(img4, file$5, 59, 16, 1629);
    			attr_dev(div7, "class", "slide svelte-1ab9e9l");
    			add_location(div7, file$5, 58, 12, 1592);
    			attr_dev(div8, "id", "slideContainer");
    			set_style(div8, "left", /*final*/ ctx[0] + "vw");
    			attr_dev(div8, "class", "svelte-1ab9e9l");
    			add_location(div8, file$5, 45, 8, 1079);
    			attr_dev(div9, "class", "cardNews svelte-1ab9e9l");
    			add_location(div9, file$5, 44, 4, 1047);
    			attr_dev(div10, "id", "page3contentBox");
    			add_location(div10, file$5, 38, 0, 850);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div10, t3);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div3, img0);
    			append_dev(div8, t4);
    			append_dev(div8, div4);
    			append_dev(div4, img1);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div5, img2);
    			append_dev(div8, t6);
    			append_dev(div8, div6);
    			append_dev(div6, img3);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, img4);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*final*/ 1) {
    				set_style(div8, "left", /*final*/ ctx[0] + "vw");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardNews', slots, []);
    	let count = 1;
    	let bigCount = 1;
    	let offset = 10;
    	let bigOffset = 12;
    	let final;

    	setInterval(
    		() => {
    			if (innerWidth <= 480) {
    				if (count < 5) {
    					offset -= 95;
    					count++;
    				} else {
    					offset += 95;
    					count++;
    				}

    				if (count >= 9) {
    					count = 1;
    				}

    				$$invalidate(0, final = offset);
    			} else {
    				if (bigCount < 4) {
    					bigOffset -= 31;
    					bigCount++;
    				} else {
    					bigOffset += 31;
    					bigCount++;
    				}

    				if (bigCount >= 7) {
    					bigCount = 1;
    				}

    				$$invalidate(0, final = bigOffset);
    			}
    		},
    		5000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardNews> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window.innerWidth);
    	}

    	$$self.$capture_state = () => ({
    		count,
    		bigCount,
    		offset,
    		bigOffset,
    		final,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('count' in $$props) count = $$props.count;
    		if ('bigCount' in $$props) bigCount = $$props.bigCount;
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('bigOffset' in $$props) bigOffset = $$props.bigOffset;
    		if ('final' in $$props) $$invalidate(0, final = $$props.final);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, innerWidth = 0);
    	return [final, innerWidth, onwindowresize];
    }

    class CardNews extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardNews",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\page3\InfoImages.svelte generated by Svelte v3.48.0 */

    const file$4 = "src\\page3\\InfoImages.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let div_style_value;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "InfoImageSprite");

    			attr_dev(div, "style", div_style_value = "background-position : " + -/*innerWidth*/ ctx[1] * (/*currentImage*/ ctx[0]
    			? /*currentImage*/ ctx[0] - 1
    			: 0) + "px 0; height: " + /*height*/ ctx[2] + "px;");

    			attr_dev(div, "class", "svelte-zv3z7n");
    			add_location(div, file$4, 15, 0, 396);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*innerWidth, currentImage, height*/ 7 && div_style_value !== (div_style_value = "background-position : " + -/*innerWidth*/ ctx[1] * (/*currentImage*/ ctx[0]
    			? /*currentImage*/ ctx[0] - 1
    			: 0) + "px 0; height: " + /*height*/ ctx[2] + "px;")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoImages', slots, []);
    	let { currentImage, isOpen } = $$props;
    	let height;
    	let width;
    	const writable_props = ['currentImage', 'isOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfoImages> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window.innerWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('currentImage' in $$props) $$invalidate(0, currentImage = $$props.currentImage);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    	};

    	$$self.$capture_state = () => ({
    		currentImage,
    		isOpen,
    		height,
    		width,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentImage' in $$props) $$invalidate(0, currentImage = $$props.currentImage);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) width = $$props.width;
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentImage, innerWidth*/ 3) {
    			currentImage == 6
    			? $$invalidate(2, height = innerWidth / 1536 * 500)
    			: $$invalidate(2, height = innerWidth / 1536 * 338);
    		}

    		if ($$self.$$.dirty & /*isOpen, currentImage, innerWidth*/ 11) {
    			if (!isOpen) {
    				$$invalidate(2, height = 0);
    			} else {
    				currentImage == 6
    				? $$invalidate(2, height = innerWidth / 1536 * 500)
    				: $$invalidate(2, height = innerWidth / 1536 * 338);
    			}
    		}
    	};

    	$$invalidate(1, innerWidth = 0);
    	return [currentImage, innerWidth, height, isOpen, onwindowresize];
    }

    class InfoImages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { currentImage: 0, isOpen: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoImages",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentImage*/ ctx[0] === undefined && !('currentImage' in props)) {
    			console.warn("<InfoImages> was created without expected prop 'currentImage'");
    		}

    		if (/*isOpen*/ ctx[3] === undefined && !('isOpen' in props)) {
    			console.warn("<InfoImages> was created without expected prop 'isOpen'");
    		}
    	}

    	get currentImage() {
    		throw new Error("<InfoImages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentImage(value) {
    		throw new Error("<InfoImages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<InfoImages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<InfoImages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Page3.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\Page3.svelte";

    function create_fragment$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let info;
    	let updating_select;
    	let updating_isOpen;
    	let t0;
    	let infoimages;
    	let t1;
    	let div1;
    	let cardnews;
    	let current;

    	function info_select_binding(value) {
    		/*info_select_binding*/ ctx[2](value);
    	}

    	function info_isOpen_binding(value) {
    		/*info_isOpen_binding*/ ctx[3](value);
    	}

    	let info_props = {};

    	if (/*selection*/ ctx[0] !== void 0) {
    		info_props.select = /*selection*/ ctx[0];
    	}

    	if (/*open*/ ctx[1] !== void 0) {
    		info_props.isOpen = /*open*/ ctx[1];
    	}

    	info = new Info({ props: info_props, $$inline: true });
    	binding_callbacks.push(() => bind(info, 'select', info_select_binding));
    	binding_callbacks.push(() => bind(info, 'isOpen', info_isOpen_binding));

    	infoimages = new InfoImages({
    			props: {
    				currentImage: /*selection*/ ctx[0],
    				isOpen: /*open*/ ctx[1]
    			},
    			$$inline: true
    		});

    	cardnews = new CardNews({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(info.$$.fragment);
    			t0 = space();
    			create_component(infoimages.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(cardnews.$$.fragment);
    			attr_dev(div0, "id", "page3Cont1");
    			attr_dev(div0, "class", "svelte-yd4g2l");
    			add_location(div0, file$3, 11, 8, 286);
    			attr_dev(div1, "id", "page3Cont2");
    			attr_dev(div1, "class", "svelte-yd4g2l");
    			add_location(div1, file$3, 15, 8, 482);
    			attr_dev(div2, "id", "contentWrapper");
    			attr_dev(div2, "class", "svelte-yd4g2l");
    			add_location(div2, file$3, 10, 4, 251);
    			attr_dev(div3, "id", "page3");
    			attr_dev(div3, "class", "grid svelte-yd4g2l");
    			add_location(div3, file$3, 9, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(info, div0, null);
    			append_dev(div2, t0);
    			mount_component(infoimages, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(cardnews, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const info_changes = {};

    			if (!updating_select && dirty & /*selection*/ 1) {
    				updating_select = true;
    				info_changes.select = /*selection*/ ctx[0];
    				add_flush_callback(() => updating_select = false);
    			}

    			if (!updating_isOpen && dirty & /*open*/ 2) {
    				updating_isOpen = true;
    				info_changes.isOpen = /*open*/ ctx[1];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			info.$set(info_changes);
    			const infoimages_changes = {};
    			if (dirty & /*selection*/ 1) infoimages_changes.currentImage = /*selection*/ ctx[0];
    			if (dirty & /*open*/ 2) infoimages_changes.isOpen = /*open*/ ctx[1];
    			infoimages.$set(infoimages_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.$$.fragment, local);
    			transition_in(infoimages.$$.fragment, local);
    			transition_in(cardnews.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info.$$.fragment, local);
    			transition_out(infoimages.$$.fragment, local);
    			transition_out(cardnews.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(info);
    			destroy_component(infoimages);
    			destroy_component(cardnews);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page3', slots, []);
    	let selection;
    	let open;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page3> was created with unknown prop '${key}'`);
    	});

    	function info_select_binding(value) {
    		selection = value;
    		$$invalidate(0, selection);
    	}

    	function info_isOpen_binding(value) {
    		open = value;
    		$$invalidate(1, open);
    	}

    	$$self.$capture_state = () => ({
    		Info,
    		CardNews,
    		InfoImages,
    		selection,
    		open
    	});

    	$$self.$inject_state = $$props => {
    		if ('selection' in $$props) $$invalidate(0, selection = $$props.selection);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selection, open, info_select_binding, info_isOpen_binding];
    }

    class Page3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page3",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\SideBar.svelte generated by Svelte v3.48.0 */

    const { console: console_1, document: document_1 } = globals;
    const file$2 = "src\\SideBar.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let div0_class_value;
    	let t7;
    	let div2;
    	let div1;
    	let span;
    	let div2_class_value;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "메인";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "타이머";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "참가팀";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "안내";
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "신청";
    			t9 = space();
    			attr_dev(li0, "class", "svelte-1qyueu7");
    			add_location(li0, file$2, 49, 12, 1161);
    			attr_dev(li1, "class", "svelte-1qyueu7");
    			add_location(li1, file$2, 50, 12, 1214);
    			attr_dev(li2, "class", "svelte-1qyueu7");
    			add_location(li2, file$2, 51, 12, 1270);
    			attr_dev(li3, "class", "svelte-1qyueu7");
    			add_location(li3, file$2, 52, 12, 1329);
    			attr_dev(ul, "class", "sc5 svelte-1qyueu7");
    			add_location(ul, file$2, 48, 8, 1131);
    			attr_dev(div0, "id", "sideBar");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*hidden_left_state*/ ctx[1]) + " svelte-1qyueu7"));
    			set_style(div0, "top", /*sideBarYOffset*/ ctx[0] + "px");
    			add_location(div0, file$2, 47, 4, 1044);
    			attr_dev(span, "class", "sc7");
    			add_location(span, file$2, 57, 12, 1573);
    			attr_dev(div1, "id", "circle");
    			attr_dev(div1, "class", "svelte-1qyueu7");
    			add_location(div1, file$2, 56, 8, 1520);
    			attr_dev(div2, "id", "applyButton");
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*hidden_right_state*/ ctx[2]) + " svelte-1qyueu7"));
    			set_style(div2, "top", "calc(70% - 45px + " + /*sideBarYOffset*/ ctx[0] + "px)");
    			add_location(div2, file$2, 55, 4, 1409);
    			attr_dev(div3, "id", "sideBarContainer");
    			attr_dev(div3, "class", "svelte-1qyueu7");
    			add_location(div3, file$2, 46, 0, 1010);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			insert_dev(target, t9, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*scrollTo*/ ctx[4]("main"), false, false, false),
    					listen_dev(li1, "click", /*scrollTo*/ ctx[4]("#page2"), false, false, false),
    					listen_dev(li2, "click", /*scrollTo*/ ctx[4]("#teamlist"), false, false, false),
    					listen_dev(li3, "click", /*scrollTo*/ ctx[4]("#Information"), false, false, false),
    					listen_dev(div1, "click", /*openLink*/ ctx[3](), false, false, false),
    					listen_dev(document_1.body, "scroll", /*setY*/ ctx[5](), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hidden_left_state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*hidden_left_state*/ ctx[1]) + " svelte-1qyueu7"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*sideBarYOffset*/ 1) {
    				set_style(div0, "top", /*sideBarYOffset*/ ctx[0] + "px");
    			}

    			if (dirty & /*hidden_right_state*/ 4 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*hidden_right_state*/ ctx[2]) + " svelte-1qyueu7"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*sideBarYOffset*/ 1) {
    				set_style(div2, "top", "calc(70% - 45px + " + /*sideBarYOffset*/ ctx[0] + "px)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBar', slots, []);
    	let y = 0;
    	let sideBarYOffset;
    	let hidden_left_state = "hidden-left";
    	let hidden_right_state = "hidden-right";

    	window.addEventListener("scroll", () => {
    		console.log('asdfasdf');
    	});

    	function sideBarStateControl(state) {
    		if (state) {
    			$$invalidate(1, hidden_left_state = "hidden-left");
    			$$invalidate(2, hidden_right_state = "hidden-right");
    		} else {
    			$$invalidate(1, hidden_left_state = null);
    			$$invalidate(2, hidden_right_state = null);
    		}
    	}

    	const openLink = () => () => {
    		window.open("https://bit.ly/8th_sunrinthon_tryout");
    	};

    	const scrollTo = where => () => {
    		const el = document.querySelector(where);
    		el.scrollIntoView({ behavior: 'smooth' });
    	};

    	const setY = () => () => {
    		$$invalidate(6, y = document.body.scrollTop);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		y,
    		sideBarYOffset,
    		hidden_left_state,
    		hidden_right_state,
    		sideBarStateControl,
    		openLink,
    		scrollTo,
    		setY
    	});

    	$$self.$inject_state = $$props => {
    		if ('y' in $$props) $$invalidate(6, y = $$props.y);
    		if ('sideBarYOffset' in $$props) $$invalidate(0, sideBarYOffset = $$props.sideBarYOffset);
    		if ('hidden_left_state' in $$props) $$invalidate(1, hidden_left_state = $$props.hidden_left_state);
    		if ('hidden_right_state' in $$props) $$invalidate(2, hidden_right_state = $$props.hidden_right_state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y*/ 64) {
    			y <= 350
    			? sideBarStateControl(true)
    			: sideBarStateControl(false);
    		}

    		if ($$self.$$.dirty & /*y*/ 64) {
    			$$invalidate(0, sideBarYOffset = y);
    		}
    	};

    	return [
    		sideBarYOffset,
    		hidden_left_state,
    		hidden_right_state,
    		openLink,
    		scrollTo,
    		setY,
    		y
    	];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Team_list.svelte generated by Svelte v3.48.0 */

    const file$1 = "src\\Team_list.svelte";

    function create_fragment$1(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let div1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let div4;
    	let div3;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div6;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Sunrinthon Team Lists";
    			t1 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "선린톤 본선 참가팀 목록";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "참가팀 목록";
    			t5 = space();
    			div4 = element("div");
    			div3 = element("div");
    			img0 = element("img");
    			t6 = space();
    			img1 = element("img");
    			t7 = space();
    			div6 = element("div");
    			div5 = element("div");
    			img2 = element("img");
    			t8 = space();
    			img3 = element("img");
    			attr_dev(p0, "class", "sc5 cream svelte-68kid0");
    			add_location(p0, file$1, 5, 20, 182);
    			attr_dev(div0, "id", "title");
    			attr_dev(div0, "class", "svelte-68kid0");
    			add_location(div0, file$1, 4, 16, 144);
    			attr_dev(p1, "class", "sc7 cream svelte-68kid0");
    			add_location(p1, file$1, 8, 20, 311);
    			attr_dev(p2, "class", "sc7 cream svelte-68kid0");
    			attr_dev(p2, "id", "pForMobile");
    			add_location(p2, file$1, 9, 20, 371);
    			attr_dev(div1, "id", "korTitle");
    			attr_dev(div1, "class", "svelte-68kid0");
    			add_location(div1, file$1, 7, 16, 270);
    			attr_dev(div2, "id", "textBox");
    			attr_dev(div2, "class", "svelte-68kid0");
    			add_location(div2, file$1, 3, 12, 108);
    			if (!src_url_equal(img0.src, img0_src_value = "/game.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "게임 참가팀");
    			attr_dev(img0, "class", "svelte-68kid0");
    			add_location(img0, file$1, 14, 20, 567);
    			if (!src_url_equal(img1.src, img1_src_value = "/web-app.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "웹-앱 참가팀");
    			attr_dev(img1, "class", "svelte-68kid0");
    			add_location(img1, file$1, 15, 20, 625);
    			attr_dev(div3, "class", "listImageContainer svelte-68kid0");
    			add_location(div3, file$1, 13, 16, 513);
    			attr_dev(div4, "id", "teamList");
    			attr_dev(div4, "class", "svelte-68kid0");
    			add_location(div4, file$1, 12, 12, 476);
    			if (!src_url_equal(img2.src, img2_src_value = "/mobile_game.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "게임 참가팀");
    			attr_dev(img2, "class", "svelte-68kid0");
    			add_location(img2, file$1, 20, 20, 821);
    			if (!src_url_equal(img3.src, img3_src_value = "/mobile_web.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "웹-앱 참가팀");
    			attr_dev(img3, "class", "svelte-68kid0");
    			add_location(img3, file$1, 21, 20, 886);
    			attr_dev(div5, "class", "listImageContainer svelte-68kid0");
    			add_location(div5, file$1, 19, 16, 767);
    			attr_dev(div6, "id", "teamList_mobile");
    			attr_dev(div6, "class", "svelte-68kid0");
    			add_location(div6, file$1, 18, 12, 723);
    			attr_dev(div7, "id", "teamConatainer");
    			add_location(div7, file$1, 2, 8, 69);
    			attr_dev(div8, "id", "contentBox");
    			add_location(div8, file$1, 1, 4, 38);
    			attr_dev(div9, "id", "teamlist");
    			attr_dev(div9, "class", "grid");
    			add_location(div9, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t3);
    			append_dev(div1, p2);
    			append_dev(div7, t5);
    			append_dev(div7, div4);
    			append_dev(div4, div3);
    			append_dev(div3, img0);
    			append_dev(div3, t6);
    			append_dev(div3, img1);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img2);
    			append_dev(div5, t8);
    			append_dev(div5, img3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Team_list', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Team_list> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Team_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team_list",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\Footer.svelte generated by Svelte v3.48.0 */

    const file = "src\\Footer.svelte";

    function create_fragment(ctx) {
    	let footer;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let div5;
    	let div3;
    	let p2;
    	let t6;
    	let p3;
    	let span0;
    	let t8;
    	let t9;
    	let p4;
    	let span1;
    	let t11;
    	let t12;
    	let p5;
    	let t13;
    	let div4;
    	let p6;
    	let t15;
    	let span2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "© 2022. 선린인터넷고등학교";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "All Rights Reserved.";
    			t4 = space();
    			div5 = element("div");
    			div3 = element("div");
    			p2 = element("p");
    			p2.textContent = "웹사이트";
    			t6 = space();
    			p3 = element("p");
    			span0 = element("span");
    			span0.textContent = "개발";
    			t8 = text(" 김동건 민경록");
    			t9 = space();
    			p4 = element("p");
    			span1 = element("span");
    			span1.textContent = "디자인";
    			t11 = text(" 임동하 이수빈 김유진");
    			t12 = space();
    			p5 = element("p");
    			t13 = space();
    			div4 = element("div");
    			p6 = element("p");
    			p6.textContent = "준비위원";
    			t15 = space();
    			span2 = element("span");
    			span2.textContent = "정연수 지민경 김동건 김서윤 김세희 이종서 송우진 이제윤 이진우 김유진 김유라 임동하 조승현 강현빈 김정은 문정윤 신동민 이수빈 최소영 민경록 윤서영";
    			attr_dev(div0, "id", "dummy");
    			attr_dev(div0, "class", "svelte-zcsmo6");
    			add_location(div0, file, 7, 8, 73);
    			add_location(p0, file, 9, 12, 157);
    			add_location(p1, file, 10, 12, 196);
    			attr_dev(div1, "id", "copyright");
    			attr_dev(div1, "class", "sc4 white");
    			add_location(div1, file, 8, 8, 105);
    			attr_dev(div2, "id", "leftDiv");
    			attr_dev(div2, "class", "svelte-zcsmo6");
    			add_location(div2, file, 6, 4, 45);
    			attr_dev(p2, "class", "sc7 white svelte-zcsmo6");
    			add_location(p2, file, 15, 12, 314);
    			attr_dev(span0, "class", "sc7 white svelte-zcsmo6");
    			add_location(span0, file, 17, 16, 396);
    			attr_dev(p3, "class", "sc4 white svelte-zcsmo6");
    			add_location(p3, file, 16, 12, 357);
    			attr_dev(span1, "class", "sc7 white svelte-zcsmo6");
    			add_location(span1, file, 20, 16, 508);
    			attr_dev(p4, "class", "sc4 white svelte-zcsmo6");
    			add_location(p4, file, 19, 12, 469);
    			attr_dev(p5, "id", "snsicons");
    			attr_dev(p5, "class", "svelte-zcsmo6");
    			add_location(p5, file, 23, 12, 588);
    			attr_dev(div3, "id", "web");
    			attr_dev(div3, "class", "svelte-zcsmo6");
    			add_location(div3, file, 14, 8, 286);
    			attr_dev(p6, "class", "sc7 white");
    			add_location(p6, file, 28, 12, 681);
    			attr_dev(span2, "class", "sc4 white");
    			add_location(span2, file, 29, 12, 724);
    			attr_dev(div4, "id", "staff");
    			attr_dev(div4, "class", "svelte-zcsmo6");
    			add_location(div4, file, 27, 8, 651);
    			attr_dev(div5, "id", "rightDiv");
    			attr_dev(div5, "class", "svelte-zcsmo6");
    			add_location(div5, file, 13, 4, 257);
    			attr_dev(footer, "class", "svelte-zcsmo6");
    			add_location(footer, file, 5, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(footer, t4);
    			append_dev(footer, div5);
    			append_dev(div5, div3);
    			append_dev(div3, p2);
    			append_dev(div3, t6);
    			append_dev(div3, p3);
    			append_dev(p3, span0);
    			append_dev(p3, t8);
    			append_dev(div3, t9);
    			append_dev(div3, p4);
    			append_dev(p4, span1);
    			append_dev(p4, t11);
    			append_dev(div3, t12);
    			append_dev(div3, p5);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div4, p6);
    			append_dev(div4, t15);
    			append_dev(div4, span2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const Sidebar = new SideBar ({
    	target: document.body
    });

    const Main = new Page1({
    	target: document.body
    });

    const TimerSchedule = new Page2({
    	target: document.body
    });

    const TeamList = new Team_list({
    	target: document.body
    });

    const InfoCard = new Page3({
    	target: document.body
    });

    const Footer = new Footer$1({
    	target: document.body
    });




    var main = [ Sidebar, Main,TimerSchedule, TeamList, InfoCard, Footer];

    return main;

})();
//# sourceMappingURL=bundle.js.map
