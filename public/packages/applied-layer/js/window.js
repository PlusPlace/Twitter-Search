/****************************************************

    Applied Layer   version 1.00
    
    ( c ) 2011 Saneyuki Tadokoro.

****************************************************/


//4294967296 ?id=32.bit
//18446744073709551616 ?id=64.bit


(function(gfxt){
	
	/*
	 * Applied Layer creator
	 *      Has a methods
	 *      v.1
	 * 
	 *  This object creates a new Applied Layer.
	 */
	var appliedLayer = function(src){return new appliedLayer.me.init(src)};
	
	appliedLayer.me = {
		// Initialize
		init: function(src){
			// If there is no "src", define as Object.
			if(!src)
				src = new Object();

			// Check if the ID is already registered or not.
			if(gfxt.sys("appl", src.id).testId()){
				// Activate by ID
				gfxt.sys("appl", src.id).getController().activate();
				// Couldn't complete initialization.
				return false;
			}
			// Check ID of src.
			if(src.id && typeof src.id == "string")
				// Set window ID
				this.id = src.id;
			else 
				// Create ID
				this.id = src.id = gfxt.sys("appl").createId();

			// Set methods of Applied Layer System
			var als = gfxt.sys("appl", this.id);
			var sys = gfxt.sys("base");
			
			if(!src.theme)
				src.theme = gfxt.sys().getAccessory("appl").$$.defaultTheme;

			// Check size of window
			if(!src.size)
				// Restored window
				src.size = "restored";
				
			this.setting = {
				sizeLimit:{
					maxWidth: null,
					minWidth: null,
					maxHeight: null,
					minHeight: null,
					maxTop: null,
					minTop: null,
					maxLeft: null,
					minLeft: null
				},
				sizeControl:{
					closeable: true,
					movable: true,
					resizable: true,
					maximizable: true,
					minimizable: true,
					fixable: true
				},
				status:{
					active: false,
					control: "new",
					exist: true
				}
			};
			
			this.eventBox = {
				wResize: null,
				activate: new Array(),
				deactivate: new Array(),
				resize: new Array(),
				restore: new Array(),
				maximize: new Array(),
				minimize: new Array(),
				fix: new Array(),
				unfix: new Array(),
				close: new Array(),
				move: new Array()
			};
			
			this.saved = new Object();
			// Increase window length
			als.increase();
			// Add window layer
			als.addLayer();
			// Register window data by ID
			als.register(this);
			// Set initialization source
			this.source = src;
			// Set the window theme
			this.theme = src.theme;
			// Set methods of part creator
			this.partCreator = partCreator(this);
			var pc = this.partCreator;
			// Set methods of controller
			this.controller = controller(this);
			var co = this.controller;
			// Set methods of manager
			this.manager = manager(this);
			var mg = this.manager;
			this.parts = new Object();
			// Create a base
			pc.createBase();
			// Create frames
			pc.createFrame();
			// Create resize points
			pc.createResizePoint();
			// Create a client area
			pc.createClientArea();
			// Create a title bar
			pc.createTitleBar();
			// Create a close button
			this.parts.titleBar.gxhandle.createCloseButton();
			// Activate the window
			co.activate();
			// Set max width of window
			mg.setMaxWidth(src.maxWidth);
			// Set min width of window
			mg.setMinWidth(src.minWidth);
			// Set width of window
			mg.setWidth(src.width);
			// Set max height of window
			mg.setMaxHeight(src.maxHeight);
			// Set min height of window
			mg.setMinHeight(src.minHeight);
			// Set height of window
			mg.setHeight(src.height);
			// Set max top of window
			mg.setMaxTop(src.maxTop);
			// Set min top of window
			mg.setMinTop(src.minTop);
			// Set top of window
			mg.setTop(src.top);
			// Set max left of window
			mg.setMaxLeft(src.maxLeft);
			// Set min left of window
			mg.setMinLeft(src.minLeft);
			// Set left of window
			mg.setLeft(src.left);
			
			if(src.title)
				this.parts.titleBar.gxhandle.createTitle(src.title);
				
			if(src.icon)
				tibd.createIcon(src.icon);
				
			if(src.closable === false)
				co.disableClose();
			
			if(src.movable === false)
				co.disableMove();
			
			if(src.resizable === false)
				co.disableResize();
				
			if(src.maximizable === false)
				co.disableMaximize();
			
			if(src.minimizable === false)
				co.disableMinimizable();
				
			if(src.fixable === false)
				co.disableFix();
				
			if(src.fix === true){
				co.enableFix();
				co.fix();
			}
				
			if(src.size == "maximized"){
				co.maximize();
			}
			else if(src.size == "minimized"){
				co.minimize();
			}
			else 
				co.restore();

			this.eventBox.wResize = sys.addEvent("resize", function(){
				mg.executeEvent("resize");
			});

			// Return data
			return this;
		}
	};
	
	appliedLayer.me.init.prototype = appliedLayer.me;



	/*
	 * Part creator
	 *      Has ? methods
	 *      v.1
	 * 
	 *  This handler creates part of Applied Layer.
	 */
	var partCreator = function(d){return new partCreator.me.init(d)};
	
	partCreator.me = {
		init: function(d){
			this.$d = d;
		},
		
		createBase: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.base)
				return false;
				
			var src = d.source;
			var ba = gfxt.sys("appl", d.id).createBase();

			if(src.parentElement)
				src.parentElement.appendChild(ba);
			else 
				document.body.appendChild(ba);
				
			pa.base = ba;
			
			return ba;
		},
		
		createFrame: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.frame)
				return false;

			var fd = gfxt.sys("appl", d.id).createFrame();
			var ba = pa.base;
			
			with(ba){
				appendChild(fd.upperLeft);
				appendChild(fd.upper);
				appendChild(fd.upperRight);
				appendChild(fd.left);
				appendChild(fd.right);
				appendChild(fd.bottomLeft);
				appendChild(fd.bottom);
				appendChild(fd.bottomRight);
				appendChild(fd.center);
			}
			
			pa.frame = fd;
			
			return fd;
		},
		
		createTitleBar: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.titleBar)
				return false;

			var id = d.id;
			var tib = gfxt.sys("appl", id).createTitleBar();
			var sys = gfxt.sys("base");
			var h = hTitleBar(id, tib, d);

			sys.extend(tib, {gxhandle: h});
			pa.frame.center.appendChild(tib);
			pa.titleBar = tib;
			// Set client area size
			d.manager.setClientAreaSize();
			
			return tib;
		},
		
		createClientArea: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.clientArea)
				return false;
				
			var id = d.id;
			var sys = gfxt.sys("base");
			var ca = gfxt.sys("appl", id).createClientArea();
			var h = hClientArea(id, ca);
			sys.extend(ca, {gxhandle: h});
			
			pa.frame.center.appendChild(ca);
			pa.clientArea = ca;
			// Set client area size
			d.manager.setClientAreaSize();
			
			return ca;
		},
		
		createResizePoint: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.resizePoint)
				return false;
			
			var rpd = gfxt.sys("appl", d.id).createResizePoint();
			var ba = pa.base;

			with(ba){
				appendChild(rpd.upperLeft);
				appendChild(rpd.upper);
				appendChild(rpd.upperRight);
				appendChild(rpd.left);
				appendChild(rpd.right);
				appendChild(rpd.bottomLeft);
				appendChild(rpd.bottom);
				appendChild(rpd.bottomRight);
			}
			
			pa.resizePoint = rpd;
			
			return rpd;
		},
		
		createMenuBar: function(){
			var d = this.$d;
			var pa = d.parts;
			
			if(pa.menuBar)
				return false;
				
			var id = d.id;
			var meb = gfxt.sys("appl", id).createMenuBar();
			var sys = gfxt.sys("base");
			var h = hMenuBar(id, meb);
			
			pa.frame.center.appendChild(meb);
			pa.menuBar = meb;
			
			sys.extend(meb, {gxhandle: h});
			// Set client area size
			d.manager.setClientAreaSize();
			
			return meb;
		}
	};
	
	partCreator.me.init.prototype = partCreator.me;


	/*
	 * Controller
	 *      Has ? methods
	 *      v.1
	 * 
	 *  This object controls Applied Layer.
	 */
	var controller = function(d){return new controller.me.init(d)};
	
	controller.me = {
		init: function(d){
			this.$d = d;
			this.$$ = gfxt.sys().getAccessory("appl").$$;
		},
		
		/* Set active window */
		activate: function(){
			var d = this.$d;
			var $$ = this.$$;
			var id = d.id;
			
			this.deactivate();
			d.setting.status.active = true;
			$$.activeWindow = id;
			gfxt.sys("appl", id).setLayer();

			d.manager.executeEvent("activate");
			
			return true;
		},

		deactivate: function(){
			var d = this.$d;
			var $$ = this.$$;
			var id = d.id;
			var aw = $$.registry[$$.activeWindow];
			if(aw){
				aw.setting.status.active = false;
				d.manager.executeEvent("deactivate");
			}

			return true;
		},
		
		/* Move window */
		move: function(x, y){
			if(!(x && y))
				return false;
				
			var d = this.$d;
			var ba = d.parts.base;

			ba.style.left = x + "px";
			ba.style.top = y + "px";

			d.manager.executeEvent("move");

			return false;
		},
		
		/* Fix position window */
		fix: function(e){
			var d = this.$d;
			
			if(d.setting.sizeControl.fixable === false)
				return false;
			
			var is = d.source.theme.imgSrc;
			var pa = d.parts;
			var ba = pa.base;
			var fb = pa.fixButton;
			var sys = gfxt.sys("base");
			var px = sys.getPageXOffset();
			var py = sys.getPageYOffset();
			
			ba.style.position = "fixed";
			ba.style.left = ba.offsetLeft - px + "px";
			ba.style.top = ba.offsetTop - py + "px";
			
			if(fb){
				fb.button.onclick = function(e){
					d.controller.unfix(e);
				};
				fb.icon.src = is.unfixButtonImg;
			}

			d.manager.executeEvent("fix");

			return true;
		},
		
		
		/* Unfix position window */
		unfix: function(e){
			var d = this.$d;
			
			if(d.setting.sizeControl.fixable === false)
				return false;
				
			var is = d.source.theme.imgSrc;
			var pa = d.parts;
			var ba = pa.base;
			var fb = pa.fixButton;
			var sys = gfxt.sys("base");
			var px = sys.getPageXOffset();
			var py = sys.getPageYOffset();
			
			ba.style.position = "absolute";
			ba.style.left = ba.offsetLeft + px + "px";
			ba.style.top = ba.offsetTop + py + "px";
			
			if(fb){
				fb.button.onclick = function(e){
					d.controller.fix(e);
				};
				fb.icon.src = is.fixButtonImg;
			}

			d.manager.executeEvent("unfix");

			return true;
		},
	
		
		/* Close window */
		close: function(e){
			var d = this.$d;

			if(d.setting.sizeControl.closeable === false)
				return false;

			var sys = gfxt.sys("base");
			var als = gfxt.sys("appl", d.id);
			var ba = d.parts.base;
			var src = d.source;

			als.deleteLayer();
			if(src.parentElement)
				src.parentElement.removeChild(ba);
			else 
				document.body.removeChild(ba);
			d.manager.executeEvent("close");
			sys.removeEvent("resize", d.eventBox.wResize);
			als.deleteRegister();
			als.decrease();

			return true;
		},
		
		
		/* Maximize window */
		maximize: function(e){
			var d = this.$d;
			var se = d.setting;
			
			if(se.status.control == "maximized" || se.sizeControl.maximizable === false)
				return false;

			var is = d.source.theme.imgSrc;
			var pa = d.parts;
			var mg = d.manager;
			var co = d.controller;
			var s = d.saved;
			var ba = pa.base;
			var tb = pa.titleBar;
			var mb = pa.maximizeButton;
			
			if(se.status.control != "restored")
				co.restore();
			
			s.baseWidth = ba.offsetWidth;
			s.baseHeight = ba.offsetHeight;
			s.baseTop = ba.offsetTop;
			s.baseLeft = ba.offsetLeft;
			mg.setWidth("100%");
			mg.setHeight("100%");
			mg.setTop(0);
			mg.setLeft(0);
			co.disableResize();

			if(tb){
				tb.onmousedown = function(e){
				};
				tb.ondblclick = function(e){
					co.restore(e);
				};
			}
			if(mb){
				mb.button.onclick = function(e){
					co.restore(e);
				};
				mb.icon.src = is.restoreButtonImg;
			}
			se.status.control = "maximized";
			
			mg.executeEvent("resize");
			mg.executeEvent("maximize");			

			return true;
		},
		
		
		/* Minimize Window */
		minimize: function(e){
			var d = this.$d;
			var se = d.setting;
			
			if(se.status.control == "minimized" || se.sizeControl.minimizable === false)
				return false;

			var is = d.source.theme.imgSrc;
			var pa = d.parts;
			var s = d.saved;
			var mg = d.manager;
			var co = d.controller;
			var ba = pa.base;
			var tb = pa.titleBar;
			var mi = pa.minimizeButton;
			var ma = pa.maximizeButton;
			var c = se.status.control;
			
			if(c != "restored")
				co.restore();
			
			if(c == "restored" && mi){
				mi.button.onclick = function(e){
					co.restore(e);
				};
			}
			else if(c == "maximized" && mi){
				mi.button.onclick = function(e){
					co.maximize(e);
				};
			}
			
			if(tb){
				tb.ondblclick = function(e){
					co.maximize(e);
				};
			}
			
			if(ma){
				ma.button.onclick = function(e){
					co.maximize(e);
				};
			}
			s.baseWidth = ba.offsetWidth;
			s.baseHeight = ba.offsetHeight;
			co.disableResize();

			mg.setWidth(se.sizeLimit.minWidth);
			mg.setHeight(ba.offsetHeight - pa.clientArea.offsetHeight);
			se.status.control = "minimized";
			
			mg.executeEvent("resize");
			mg.executeEvent("minimize");
			
			return true;
		},
		
		
		/* Restore window */
		restore: function(e){
			var d = this.$d;
			var se = d.setting;
			
			if(se.status.control == "resotred")
				return false;
				
			var is = d.source.theme.imgSrc;
			var pa = d.parts;
			var s = d.saved;
			var co = d.controller;
			var mg = d.manager;
			var ba = pa.base;
			var tib = pa.titleBar;
			var mi = pa.minimizeButton;
			var ma = pa.maximizeButton;
			
			if(se.status.control == "new"){
				se.status.control = "restored";
				return true;
			}

			if(mi){
				mi.button.onclick = function(e){
					co.minimize(e);
				};
			}

			if(ma){
				ma.button.onclick = function(e){
					co.maximize(e);
				};
				ma.icon.src = is.maximizeButtonImg;
			}
			
			if(tib){
				tib.onmousedown = function(e){
					mg.setMovable(e);
				};
				tib.ondblclick = function(e){
					co.maximize(e);
				};
			}
			
			mg.setWidth(s.baseWidth);
			mg.setHeight(s.baseHeight);
			mg.setTop(s.baseTop);
			mg.setLeft(s.baseLeft);
			se.status.control = "restored";
			co.enableResize();
			
			mg.executeEvent("resize");
			mg.executeEvent("restore");
			
			return true;
		},
		
		renameTitle: function(t){
			if(!t || typeof t != "string")
				t = gfxt.sys().getPackage("appl").$$.defaultTitle;

			this.$d.parts.title.innerHTML = t;
		},
		
		disableClose: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.closable === true)
				sc.closable = false;
		},
		
		enableClose: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.closable === true)
				sc.closable = false;
		},
		
		disableMove: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.movable === true)
				sc.movable = false;
		},
		
		enableMove: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.movable === false)
				sc.movable = true;
		},
		
		disableFix: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.fixable === true)
				sc.fixable = false;
		},
		
		enableFix: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.fixable === false)
				sc.fixable = true;
		},
		
		disableMaximize: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.maximizable === true)
				sc.maximizable = false;
		},
		
		enableMaximize: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.maximizable === false)
				sc.maximizable = true;
		},
		
		disableMinimize: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.minimizable === true)
				sc.minimizable = false;
		},
		
		enableMinimize: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.minimizable === false)
				sc.minimizable = true;
		},
		
		
		/* Disable resize points of window */
		disableResize: function(){
			var rp, sc = this.$d.setting.sizeControl;
			if(sc.resizable === true){
				sc.resizable = false;
				rp = this.$d.parts.resizePoint;
				rp.upperLeft.style.cursor = 'default';
				rp.upper.style.cursor = 'default';
				rp.upperRight.style.cursor = 'default';
				rp.left.style.cursor = 'default';
				rp.right.style.cursor = 'default';
				rp.bottomLeft.style.cursor = 'default';
				rp.bottom.style.cursor = 'default';
				rp.bottomRight.style.cursor = 'default';
			}
		},
		
		
		/* Enable resize points of window */
		enableResize: function(){
			var sc = this.$d.setting.sizeControl;
			if(sc.resizable === false){
				sc.resizable = true;
				rp = this.$d.parts.resizePoint;
				rp.upperLeft.style.cursor = 'pointer';
				rp.upper.style.cursor = 'pointer';
				rp.upperRight.style.cursor = 'pointer';
				rp.left.style.cursor = 'pointer';
				rp.right.style.cursor = 'pointer';
				rp.bottomLeft.style.cursor = 'pointer';
				rp.bottom.style.cursor = 'pointer';
				rp.bottomRight.style.cursor = 'pointer';
			}
		},

		enableCloseButton: function(){
			var d = this.$d;
			var cb = d.parts.closeButton;
			
			if(!cb || cb.button.gxstatus == "enabled")
				return false;
			
			var is = d.theme.imgSrc.closeButtonImg;
				
			cb.button.gxstatus = "enabled";
			cb.icon.src = is;
		},
		
		disableCloseButton: function(){
			var d = this.$d;
			var cb = d.parts.closeButton;
			
			if(!cb || cb.button.gxstatus == "disabled")
				return false;
			
			var is = d.theme.imgSrc.disabledCloseButtonImg;

			cb.button.gxstatus = "disabled";
			cb.icon.src = is;
		},
		
		enableMaximizeButton: function(){
			var d = this.$d;
			var mb = d.parts.maximizeButton;
			
			if(!mb || mb.button.gxstatus == "enabled")
				return false;
				
			var is = d.theme.imgSrc.maximizeButtonImg;
			
			mb.button.gxstatus = "enabled";
			mb.icon.src = is;
		},
		
		disableMaximizeButton: function(){
			var d = this.$d;
			var mb = d.parts.maximizeButton;
			
			if(!mb || mb.button.gxstatus == "disabled")
				return false;
				
			var is = d.theme.imgSrc.disabledMaximizeButtonImg;
				
			mb.button.gxstatus = "disabled";
			mb.icon.src = is;
		},
		
		enableMinimizeButton: function(){
			var d = this.$d;
			var ib = d.parts.minimizeButton;
			
			if(!ib || ib.button.gxstatus == "enabled")
				return false;
				
			var is = d.theme.imgSrc.minimizeButtonImg;
				
			ib.button.gxstatus = "enabled";
			ib.icon.src = is;
		},
		
		disableMinimizeButton: function(){
			var d = this.$d;
			var ib = d.parts.minimizeButton;
			
			if(!ib || ib.button.gxstatus == "disabled")
				return false;
				
			var is = d.theme.imgSrc.disabledMinimizeButtonImg;
				
			ib.button.gxstatus = "disabled";
			ib.icon.src = is;
		},
		
		enableFixButton: function(){
			var d = this.$d;
			var fb = d.parts.fixButton;
			
			if(!fb || fb.button.gxstatus == "enabled")
				return false;
				
			var is = d.theme.imgSrc.fixButtonImg;
				
			fb.button.gxstatus = "enabled";
			fb.icon.src = is;
		},
		
		disableFixButton: function(){
			var d = this.$d;
			var fb = d.parts.fixButton;
			
			if(!fb || fb.button.gxstatus == "disabled")
				return false;
				
			var is = d.theme.imgSrc.disabledFixButtonImg;
				
			fb.button.gxstatus = "disabled";
			fb.icon.src = is;
		},
		
		/* Resize (Point: upper left corner of window) */
		resizeUpperLeft: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var sx = s.startEventX;
			var sy = s.startEventY;
			var ex = e.pageX ? e.pageX : event.x;
			var ey = e.pageY ? e.pageY : event.y;
			var w = s.startWidth + (sx - ex);
			var h = s.startHeight + (sy - ey);
			var t = s.startTop - (sy - ey);
			var l = s.startLeft - (sx - ex);
			
			if(mg.setWidth(w)) mg.setLeft(l);
			if(mg.setHeight(h)) mg.setTop(t);
				
			mg.executeEvent("resize");	
			
			return false;
		},

		
		/* Resize (Point: upper line of window) */
		resizeUpper: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var ey = e.pageY ? e.pageY : event.y;
			var h = s.startHeight + (s.startEventY - ey);
			var t = s.startTop - (s.startEventY - ey);
			
			if(mg.setHeight(h)) mg.setTop(t);
			
			mg.executeEvent("resize");
			
			return false;
		},
		
		
		/* Resize (Point: upper right corner of window) */
		resizeUpperRight: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var sy = s.startEventY;
			var ex = e.pageX ? e.pageX : event.x;
			var ey = e.pageY ? e.pageY : event.y;
			var h = s.startHeight + (sy - ey);
			var w = s.startWidth - (s.startEventX - ex);
			var t  = s.startTop - (sy - ey);
			
			if(mg.setHeight(h)) mg.setTop(t);
			mg.setWidth(w);

			mg.executeEvent("resize");

			return false;
		},
		
		
		/* Resize (Point: left line of window) */
		resizeLeft: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var sx = s.startEventX;
			var ex = e.pageX ? e.pageX : event.x;
			var w = s.startWidth + (sx - ex);
			var l = s.startLeft - (sx - ex);
			
			if(mg.setWidth(w)) mg.setLeft(l);
				
			mg.executeEvent("resize");
				
			return false;
		},
		
		
		/* Resize (Point: right line of window) */
		resizeRight: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var ex = e.pageX ? e.pageX : event.x;
			var w = s.startWidth - (s.startEventX - ex);
			
			mg.setWidth(w);
			
			mg.executeEvent("resize");
			
			return false;
		},
		
		
		/* Resize (Point: bottom left corner of window) */
		resizeBottomLeft: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var sx = s.startEventX;
			var ex = e.pageX ? e.pageX : event.x;
			var ey = e.pageY ? e.pageY : event.y;
			var h = s.startHeight - (s.startEventY - ey);
			var w = s.startWidth + (sx - ex);
			var l = s.startLeft - (sx - ex);
			
			if(mg.setWidth(w)) mg.setLeft(l);
			mg.setHeight(h);
			
			mg.executeEvent("resize");
			
			return false;
		},
		
		
		/* Resize (Point: bottom line of window) */
		resizeBottom: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var ey = e.pageY ? e.pageY : event.y;
			var h = s.startHeight - (s.startEventY - ey);
			
			mg.setHeight(h);
			
			mg.executeEvent("resize");
			
			return false;
		},
		
		
		/* Resize (Point: bottom right corner of window) */
		resizeBottomRight: function(e){
			var d = this.$d;
			var s = d.saved;
			var mg = d.manager;
			var ex= e.pageX ? e.pageX : event.x;
			var ey = e.pageY ? e.pageY : event.y;
			var h = s.startHeight - (s.startEventY - ey);
			var w = s.startWidth - (s.startEventX - ex);
			
			mg.setHeight(h);
			mg.setWidth(w);
			
			mg.executeEvent("resize");
			
			return false;
		}
	};
	
	controller.me.init.prototype = controller.me;
	
	
	
	/*
	 * Manager
	 *      Has ? methods
	 *      v.1
	 * 
	 *  This object manages Applied Layer.
	 */
	var manager = function(d){return new manager.me.init(d)};
	
	manager.me = {
		init: function(d){
			this.$d = d;
			this.$$ = gfxt.sys().getAccessory("appl").$$;
		},
		
		executeEvent: function(t){
			var i;
			var e = this.$d.eventBox;
			if(t == "resize"){
				for(i = 0; e.resize[i]; i++)
					e.resize[i]();
			}
			else if(t == "restore"){
				for(i = 0; e.restore[i]; i++)
					e.restore[i]();
			}
			else if(t == "maximize"){
				for(i = 0; e.maximize[i]; i++)
					e.maximize[i]();
			}
			else if(t == "minimize"){
				for(i = 0; e.minimize[i]; i++)
					e.minimize[i]();
			}
			else if(t == "fix"){
				for(i = 0; e.fix[i]; i++)
					e.fix[i]();
			}
			else if(t == "unfix"){
				for(i = 0; e.unfix[i]; i++)
					e.unfix[i]();
			}
			else if(t == "move"){
				for(i = 0; e.move[i]; i++)
					e.move[i]();
			}
			else if(t == "close"){
				for(i = 0; e.close[i]; i++)
					e.close[i]();
			}
			else if(t == "activate"){
				for(i = 0; e.activate[i]; i++)
					e.activate[i]();
			}
			else if(t == "deactivate"){
				for(i = 0; e.deactivate[i]; i++)
					e.deactivate[i]();
			}
		},
		
		addEvent: function(t, h){
			var e = this.$d.eventBox;
			if(t == "resize")
				e.resize[e.resize.length] = h;
			else if(t == "restore")
				e.restore[e.restore.length] = h;
			else if(t == "maximize")
				e.maximize[e.maximize.length] = h;
			else if(t == "minimize")
				e.minimize[e.minimize.length] = h;
			else if(t == "fix")
				e.fix[e.fix.length] = h;
			else if(t == "unfix")
				e.unfix[e.unfix.length] = h;
			else if(t == "close")
				e.close[e.close.length] = h;
			else if(t == "move")
				e.move[e.move.length] = h;
			else if(t == "activate")
				e.activate[e.activate.length] = h;
			else if(t == "deactivate")
				e.deactivate[e.deactivate.length] = h;
				
			return h;
		},
		
		removeEvent: function(t, h){
			var i;
			var e = this.$d.eventBox;
			if(t == "resize"){
				for(i = 0 ; e.resize[i] ; i++){
					if(e.resize[i] == h) e.resize.splice(i, 1);
				}
			}
			else if(t == "restore"){
				for(i = 0 ; e.restore[i] ; i++){
					if(e.restore[i] == h) e.restore.splice(i, 1);
				}
			}
			else if(t == "maximize"){
				for(i = 0 ; e.maximize[i] ; i++){
					if(e.maximzie[i] == h) e.maximize.splice(i, 1);
				}
			}
			else if(t == "minimize"){
				for(i = 0 ; e.minimize[i] ; i++){
					if(e.minimize[i] == h) e.minimize.splice(i, 1);
				}
			}
			else if(t == "fix"){
				for(i = 0 ; e.fix[i] ; i++){
					if(e.fix[i] == h) e.fix.splice(i, 1);
				}
			}
			else if(t == "move"){
				for(i = 0 ; e.move[i] ; i++){
					if(e.move[i] == h) e.move.splice(i, 1);
				}
			}
			else if(t == "close"){
				for(i = 0 ; e.close[i] ; i++){
					if(e.close[i] == h) e.close.splice(i, 1);
				}
			}
			else if(t == "move"){
				for(i = 0 ; e.close[i] ; i++){
					if(e.move[i] == h) e.move.splice(i, 1);
				}
			}
			else if(t == "activate"){
				for(i = 0 ; e.activate[i] ; i++){
					if(e.activate[i] == h) e.activate.splice(i, 1);
				}
			}
			else if(t == "deactivate"){
				for(i = 0 ; e.deactivate[i] ; i++){
					if(e.deactivate[i] == h) e.deactivate.splice(i, 1);
				}
			}
		},
		
		/* Make window movable */
		setMovable: function(e){
			var d = this.$d;
			
			if(d.setting.sizeControl.movable === false)
				return false;
				
			var id = d.id;
			var ba = d.parts.base;
			var als = gfxt.sys("appl", id);
			var sys = gfxt.sys("base");
			var sx = e ? e.pageX : event.clientX + document.body.scrollLeft;
			var sy = e ? e.pageY : event.clientY + document.body.scrollTop;
			var ox = ba.offsetLeft;
			var oy = ba.offsetTop;
			d.controller.activate();
			d.status = "movable";
				
			// 
			var r1 = sys.addEvent("selectstart", function(){
				return false;
			}, window);
			// 
			var r2 = sys.addEvent("mousemove", function(ee){
				var x = ee.pageX ? ee.pageX : event.clientX + document.body.scrollLeft;
				var y = ee.pageY ? ee.pageY : event.clientY + document.body.scrollTop;
				x = ox - (sx - x);
				y = oy - (sy - y);
				d.controller.move(x, y);
			}, window);
			//
			var r3 = sys.addEvent("mouseup", function(){
				sys.removeEvent("selectstart", r1.listener, r1.target);
				sys.removeEvent("mousemove", r2.listener, r2.target);
				sys.removeEvent("mouseup", r3.listener, r3.target);
			});
			
				
			return true;
		},
		
		setResizable: function(t, e){
			var d = this.$d;
			
			if(d.setting.sizeControl.resizable === false)
				return false;
			
			var lis;
			var id = d.id;
			var ba = d.parts.base;
			var s = d.saved;
			var co = d.controller;
			var als = gfxt.sys("appl", id);
			var sys = gfxt.sys("base");
			var sx = e ? e.pageX : event.x;
			var sy = e ? e.pageY : event.y;
			s.startEventX = sx;
			s.startEventY = sy;
			s.startLeft = ba.offsetLeft;
			s.startTop = ba.offsetTop;
			s.startWidth = ba.offsetWidth;
			s.startHeight = ba.offsetHeight;
			
			if(t == "upper-left") 			lis = function(e){co.resizeUpperLeft(e)};
			else if(t == "upper") 			lis = function(e){co.resizeUpper(e)};
			else if(t == "upper-right") 	lis = function(e){co.resizeUpperRight(e)};
			else if(t == "left") 			lis = function(e){co.resizeLeft(e)};
			else if(t == "right") 			lis = function(e){co.resizeRight(e)};
			else if(t == "bottom-left") 	lis = function(e){co.resizeBottomLeft(e)};
			else if(t == "bottom") 			lis = function(e){co.resizeBottom(e)};
			else if(t == "bottom-right") 	lis = function(e){co.resizeBottomRight(e)};
			// 
			var r1 = sys.addEvent("selectstart", function(){
				return false;
			});
			//
			var r2 = sys.addEvent("mousemove", lis);
			//
			var r3 = sys.addEvent("mouseup", function(){
				sys.removeEvent("selectstart", r1.listener, r1.target);
				sys.removeEvent("mousemove", r2.listener, r2.target);
				sys.removeEvent("mouseup", r3.listener, r3.target);
			});
		},
		
		setIcon: function(src){
			var d = this.$d;
			if(!src || typeof src != "string" || src == "default")
				src = d.source.theme.imgSrc.defaultIcon;
			d.parts.icon.src = src;
		},
		
		setClientAreaSize: function(){
			var tibh, mebh;
			var pa = this.$d.parts;
			var ca = pa.clientArea;
			var tib = pa.titleBar;
			var meb = pa.menuBar;
			
			if(!tib)
				tibh = 0;
			else 
				tibh = tib.offsetHeight;
			
			if(!meb)
				mebh = 0;
			else 
				mebh = meb.offsetHeight;

			if(!ca)
				return false;
			else 
				ca.style.top = tibh + mebh + "px";
		},
		
		setWidth: function(w){
			var d = this.$d;
			var $$ = this.$$;
			var sl = d.setting.sizeLimit;
			var mg = d.manager;
			var ba = d.parts.base;
			var maxw = sl.maxWidth;
			var minw = sl.minWidth;

			if(typeof w != "number" && w != "100%"){
				ba.style.width = $$.defaultWidth + "px";
				return false;
			}

			if(!(
				(maxw == "unlimited" || w <= maxw || w == "100%") &&
				(minw == "unlimited" || w >= minw || w == "100%")
			))
				return false;

			if(w == "100%")
				ba.style.width = w;
			else 
				ba.style.width = w + "px";
				
			mg.setClientAreaSize();
				
			return true;
		},
		
		setHeight: function(h){
			var d = this.$d;
			var $$ = this.$$;
			var sl = d.setting.sizeLimit;
			var mg = d.manager;
			var ba = d.parts.base;
			var maxh = sl.maxWidth;
			var minh = sl.minHeight;
			
			if(typeof h != "number" && h != "100%"){
				ba.style.height = $$.defaultHeight + "px";
				return false;
			}
			if(!(
				(maxh == "unlimited" || h <= maxh || h == "100%") &&
				(minh == "unlimited" || h >= minh || h == "100%")
			))
				return false;

			if(h == "100%")
				ba.style.height = h;
			else 
				ba.style.height = h + "px";
				
			mg.setClientAreaSize();
				
			return true;
		},
		
		setTop: function(t){
			var d = this.$d;
			var $$ = this.$$;
			var sl = d.setting.sizeLimit;
			var mg = d.manager;
			var ba = d.parts.base;
			var maxt = sl.maxTop;
			var mint = sl.minTop;
			
			if(typeof t != "number"){
				ba.style.top = $$.defaultTop + "px";
				return false;
			}
			if(!(
				(maxt == "unlimited" || t <= maxt) &&
				(mint == "unlimited" || t >= mint)
			))
				return false;

			ba.style.top = t + "px";
			return true;
		},
		
		setLeft: function(l){
			var d = this.$d;
			var $$ = this.$$;
			var sl = d.setting.sizeLimit;
			var mg = d.manager;
			var ba = d.parts.base;
			var maxl = sl.maxLeft;
			var minl = sl.minLeft;
			
			if(typeof l != "number"){
				ba.style.left = $$.defaultLeft + "px";
				return false;
			}
			if(!(
				(maxl == "unlimited" || l <= maxl) &&
				(minl == "unlimited" || l >= minl)
			))
				return false;

			ba.style.left = l + "px";
			return true;
		},
		
		setMaxWidth: function(maxw){
			if(!maxw)
				maxw = this.$$.defaultMaxWidth;
			this.$d.setting.sizeLimit.maxWidth = maxw;
		},
		
		setMinWidth: function(minw){
			if(!minw)
				minw = this.$$.defaultMinWidth;
			this.$d.setting.sizeLimit.minWidth = minw;
		},
		
		setMaxHeight: function(maxh){
			if(!maxh)
				maxh = this.$$.defaultMaxHeight;
			this.$d.setting.sizeLimit.maxHeight = maxh;
		},
		
		setMinHeight: function(minh){
			if(!minh)
				minh = this.$$.defaultMinHeight;
			this.$d.setting.sizeLimit.minHeight = minh;
		},
		
		setMaxTop: function(maxt){
			if(!maxt)
				maxt = this.$$.defaultMaxTop;
			this.$d.setting.sizeLimit.maxTop = maxt;
		},
		
		setMinTop: function(mint){
			if(!mint)
				mint = this.$$.defaultMinTop;
			this.$d.setting.sizeLimit.minTop = mint;
		},
		
		setMaxLeft: function(maxl){
			if(!maxl)
				maxl = this.$$.defaultMaxLeft;
			this.$d.setting.sizeLimit.maxLeft = maxl;
		},
		
		setMinLeft: function(minl){
			if(!minl)
				minl = this.$$.defaultMinLeft;
			this.$d.setting.sizeLimit.minLeft = minl;
		},
		
		getLayer: function(){
			return this.$$.windowLayer[this.$d.id];
		},
		
		getWidth: function(){
			return this.$d.object.base.offsetWidth;
		},
		
		getHeight: function(){
			return this.$d.object.base.offsetHeight;
		},
		
		getTop: function(){
			return this.$d.object.base.offsetTop;
		},
		
		getLeft: function(){
			return this.$d.object.base.offsetLeft;
		},
		
		getSource: function(){
			return this.$d.source;
		},
		
		getTheme: function(){
			return this.$d.theme;
		},
		
		getParts: function(){
			return this.$d.parts;
		},
		
		getEventBox: function(){
			return this.$d.eventBox;
		},
		
		getBaseObject: function(){
			return this.$d.baseObject;
		},
		
		getPartCreator: function(){
			return this.$d.partCreator;
		},
		
		getController: function(){
			return this.$d.controller;
		},
		
		getManager: function(){
			return this.$d.manager;
		},
		
		getSetting: function(){
			return this.$d.setting;
		},
		
		getSaved: function(){
			return this.$d.saved;
		},
		
		getStatus: function(){
			return this.$d.status;
		}
	};
	
	manager.me.init.prototype = manager.me;



	/*
	 * Title bar handler
	 *      Has ? methods
	 *      v.1
	 * 
	 * < INSERT THE EXPLANATION >
	 */
	var hTitleBar = function(id, tib, d){return new hTitleBar.me.init(id, tib, d)};
	
	hTitleBar.me = {
		init: function(id, tib, d){
			this.id = id;
			this.titleBar = tib;
			this.$$ = d;
		},

		createCloseButton: function(){
			if(this.$$.parts.closeButton)
				return false;
			
			var id = this.$$.id;
			var cbd = gfxt.sys("appl", id).createCloseButton();
			
			this.$$.parts.closeButton = cbd;
			this.$$.parts.base.appendChild(cbd.button);
			
			return cbd;
		},

		createMaximizeButton: function(){
			if(this.$$.parts.maximizeButton)
				return false;
				
			var id = this.$$.id;
			var mabd = gfxt.sys("appl", id).createMaximizeButton();
			
			this.$$.parts.maximizeButton = mabd;
			this.$$.parts.base.appendChild(mabd.button);
			
			return mabd;
		},

		createMinimizeButton: function(){
			if(this.$$.parts.minimizeButton)
				return false;
			
			var id = this.$$.id;
			var mibd = gfxt.sys("appl", id).createMinimizeButton();
			
			this.$$.parts.minimizeButton = mibd;
			this.$$.parts.base.appendChild(mibd.button);
			
			return mibd;
		},

		createFixButton: function(){
			if(this.$$.parts.fixButton)
				return false;
			
			var id = this.$$.id;
			var fbd = gfxt.sys("appl", id).createFixButton();
			
			this.$$.parts.fixButton = fbd;
			this.$$.parts.base.appendChild(fbd.button);
			
			return fbd;
		},

		createIcon: function(is){
			if(this.$$.parts.icon)
				return false;
				
			var id = this.$$.id;
			var ic = gfxt.sys("appl", id).createIcon();
			
			this.$$.parts.icon = ic;
			this.$$.parts.titleBar.appendChild(ic);
			
			this.$$.manager.setIcon(is);
			
			return ic;
		},

		createTitle: function(tit){
			if(this.$$.parts.title)
				return false;
			
			var id = this.$$.id;
			var ti = gfxt.sys("appl", id).createTitle();
			
			this.$$.parts.title = ti;
			this.$$.parts.titleBar.appendChild(ti);
			
			this.$$.controller.renameTitle(tit);
			
			return ti;
		}
	};
	
	hTitleBar.me.init.prototype = hTitleBar.me;
	
	
	
	
	/*
	 * Client area handler
	 *      Has ? methods
	 *      v.1
	 * 
	 * < INSERT THE EXPLANATION >
	 */
	var hClientArea = function(id, ca){return new hClientArea.me.init(id, ca)};
	
	hClientArea.me = {
		init: function(id, ca){
			this.id = id;
			this.clientArea = ca;
		},
		
		createStyleFrame: function(){
			var mgr = gfxt.sys("appl", this.id).getManager();
			var ca = this.clientArea;
			var sfd = gfxt.styleFrame();
			var sf = sfd.styleFrame;
			mgr.addEvent("resize", function(){
				sf.gxhandle.refresh();
			});
			ca.appendChild(sf);
			return sfd;
		}
	};
	
	hClientArea.me.init.prototype = hClientArea.me;
	
	
	
	/*
	 * Menu bar handler
	 *      Has ? methods
	 *      v.1
	 * 
	 * < INSERT THE EXPLANATION >
	 */
	var hMenuBar = function(id, meb){return new hMenuBar.me.init(id, meb)};
	
	hMenuBar.me = {
		init: function(id, meb){
			this.id = id;
			this.menuBar = meb;
		},
		
		createMenuButton: function(la){
			var id = this.id;
			var meb = this.menuBar;
			var als = gfxt.sys("appl", id);
			var sys = gfxt.sys("base");
			var mebn = als.createMenuButton();
			var txt = document.createTextNode(la);
			var h = hMenuButton(id, mebn);

			meb.appendChild(mebn);
			mebn.appendChild(txt);
			sys.extend(mebn, {gxhandle: h});
			h.deactivate();
			
			mebn.onclick = function(){
				mebn.gxhandle.activate(mebn.offsetLeft, meb.offsetTop + mebn.offsetTop + mebn.offsetHeight);
			};
			
			return mebn;
		},
		
		removeMenuButton: function(mebn){
			var meb = this.menuBar;
			meb.removeChild(mebn);
		}
	};
	
	hMenuBar.me.init.prototype = hMenuBar.me;
	
	
	
	/*
	 * Menu button handler
	 *      Has ? methods
	 *      v.1
	 * 
	 * < INSERT THE EXPLANATION >
	 */
	var hMenuButton = function(id, mebn){return new hMenuButton.me.init(id, mebn)};
	
	hMenuButton.me =  {
		init: function(id, mebn){
			this.id = id;
			this.menuButton = mebn;
		},
		
		createMenu: function(){
			var id = this.id;
			var als = gfxt.sys("appl", id);
			var sys = gfxt.sys("base");
			var me = als.createMenu();
			var h = hMenu(id, me);
			sys.extend(me, {gxhandle: h});
			this.menu = me;
			return me;
		},
		
		activate: function(x, y){
			var als = gfxt.sys("appl", this.id);
			var fc = als.getParts().frame.center;
			this.menu.gxhandle.activate(x, y, fc);
		},
		
		deactivate: function(){
			//this.menu.gxhandle.deactivate();
		}
	};
	
	hMenuButton.me.init.prototype = hMenuButton.me;
	
	
	
	/*
	 * Menu handler
	 *      Has ? methods
	 *      v.1
	 * 
	 * < INSERT THE EXPLANATION >
	 */
	var hMenu = function(id, me){return new hMenu.me.init(id, me)};
	
	hMenu.me = {
		init: function(id, me){
			this.id = id;
			this.menu = me;
		},
		
		createMenuItem: function(it, la, func){
			var id = this.id;
			var me = this.menu;
			var als = gfxt.sys("appl", id);
			var sys = gfxt.sys("base");
			var oi = als.createId();
			var mid = als.createMenuItem();
			var mi = mid.menuItem;
			var lai = mid.label;
			var ii = mid.icon;
			var txt = document.createTextNode(la);
			lai.appendChild(txt);
			me.appendChild(mi);
			mi.onmousedown = function(){
				func();
			};
			return mid;
		},
		
		removeMenuItem: function(mi){
			var me = this.menu;
			me.removeChild(mi);
		},
		
		activate: function(x, y, into){
			var d = this;
			var me = this.menu;
			var sys = gfxt.sys("base");
			var r = sys.addEvent("mousedown", function(){
				d.deactivate();
				sys.removeEvent("mousedown", r.listener);
			});
			if(into)
				into.appendChild(me);
			else 
				document.body.appendChild(me);
			me.style.top = y + "px";
			me.style.left = x + "px";
		},
		
		deactivate: function(){
			var me = this.menu;
			if(me.parentNode)
				me.parentNode.removeChild(me);
			else 
				document.body.removeChild(me);
		}

	};
	
	hMenu.me.init.prototype = hMenu.me;
	

	/*
	 * Applied Layer system
	 *      Has ? methods
	 *      v.1
	 * 
	 * The common functions for Applied-Layers
	 */
	var applPackage = (function(){
		var core = function(){
			var ID = null;
			var method = {
				handler: function(pn, id){
					ID = id;
				},
				
				createBase: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					var sys = gfxt.sys("base");
					var id = ID;
					var cn = method.getTheme().className;
					var ba = document.createElement("div");
					
					ba.className = cn.base;
					ba.style.zIndex = $$.defaultZIndex;
					sys.addEvent("mousedown", function(){
						var con = gfxt.sys("appl", id).getController()
						if( con )
							con.activate();
					}, ba);
					
					return ba;
				},
				
				createFrame: function(){
					var cn = method.getTheme().className;
					var fd = new Object();
					// Upper left
					fd.upperLeft = document.createElement("div");
					fd.upperLeft.className = cn.upperLeftFrame;
					// Upper
					fd.upper = document.createElement("div");
					fd.upper.className = cn.upperFrame;
					// Upper right
					fd.upperRight = document.createElement("div");
					fd.upperRight.className = cn.upperRightFrame;
					// Left
					fd.left = document.createElement("div");
					fd.left.className = cn.leftFrame;
					// Center
					fd.center = document.createElement("div");
					fd.center.className = cn.centerFrame;
					// Right
					fd.right = document.createElement("div");
					fd.right.className = cn.rightFrame;
					// Bottom left
					fd.bottomLeft = document.createElement("div");
					fd.bottomLeft.className = cn.bottomLeftFrame;
					// Bottom
					fd.bottom = document.createElement("div");
					fd.bottom.className = cn.bottomFrame;
					// Bottom right
					fd.bottomRight = document.createElement("div");
					fd.bottomRight.className = cn.bottomRightFrame;
					
					return fd;
				},
				
				createTitleBar: function(){
					var sys = gfxt.sys("base");
					var id = ID;
					var cn = method.getTheme().className;
					var md = method.createMenu();
					var h = hMenu(id, md);
					var tib = tib = document.createElement("div");
					tib.className = cn.titleBar;
					tib.onmousedown = function(e){
						gfxt.sys("appl", id).getManager().setMovable(e);
					};
					tib.ondblclick = function(e){
						gfxt.sys("appl", id).getController().maximize(e);
					};
					tib.oncontextmenu = function(e){
						var ex = e ? e.pageX : event.x;
						var ey = e ? e.pageY : event.y;
						md.menu.style.zIndex = "100";
						md.activate(ex, ey);
						return false;
					};
					sys.extend(md, h);
					md.createMenuItem("", "Close", function(){
						gfxt.sys("appl", id).getController().close();
					});
					
					return tib;
				},
				
				createClientArea: function(){
					var cn = method.getTheme().className;
					var ca = document.createElement("div");
					ca.className = cn.clientArea;
					ca.objectType = "client-area";
					return ca;
				},
				
				createResizePoint: function(){
					var id = ID;
					var cn = method.getTheme().className;
					var rpd = new Object();
					var h = function(ty, e){
						gfxt.sys("appl", id).getManager().setResizable(ty, e);
					};
					// Upper left
					rpd.upperLeft = document.createElement("div");
					rpd.upperLeft.className = cn.upperLeftResizingPoint;
					rpd.upperLeft.onmousedown = function(e){
						h("upper-left", e);
					};
					// Upper
					rpd.upper = document.createElement("div");
					rpd.upper.className = cn.upperResizingPoint;
					rpd.upper.onmousedown = function(e){
						h("upper", e);
					};
					// Upper right
					rpd.upperRight = document.createElement("div");
					rpd.upperRight.className = cn.upperRightResizingPoint;
					rpd.upperRight.onmousedown = function(e){
						h("upper-right", e);
					};
					// Left
					rpd.left = document.createElement("div");
					rpd.left.className = cn.leftResizingPoint;
					rpd.left.onmousedown = function(e){
						h("left", e);
					};
					// Right
					rpd.right = document.createElement("div");
					rpd.right.className = cn.rightResizingPoint;
					rpd.right.onmousedown = function(e){
						h("right", e);
					};
					// Bottom left
					rpd.bottomLeft = document.createElement("div");
					rpd.bottomLeft.className = cn.bottomLeftResizingPoint;
					rpd.bottomLeft.onmousedown = function(e){
						h("bottom-left", e);
					};
					// Bottom
					rpd.bottom = document.createElement("div");
					rpd.bottom.className = cn.bottomResizingPoint;
					rpd.bottom.onmousedown = function(e){
						h("bottom", e);
					};
					// Bottom right
					rpd.bottomRight = document.createElement("div");
					rpd.bottomRight.className = cn.bottomRightResizingPoint;
					rpd.bottomRight.onmousedown = function(e){
						h("bottom-right", e);
					};
						
					return rpd;
				},
				
				createMenuBar: function(){
					var cn = method.getTheme().className;
					var meb = document.createElement("div");
					meb.className = cn.menuBar;
					return meb;
				},
				
				createMenuButton: function(){
					var cn = method.getTheme().className;
					var mb = document.createElement("div");
					mb.className = cn.menuButton;
					return mb;
				},
				
				createIcon: function(){
					var cn = method.getTheme().className;
					var ic = document.createElement("img");
					ic.className = cn.icon;
					
					return ic;
				},
				
				createTitle: function(){
					var cn = method.getTheme().className;
					var ti = document.createElement("span");
					ti.className = cn.title;
					
					return ti;
				},
				
				createCloseButton: function(){
					var id = ID;
					var cn = method.getTheme().className;
					var is = method.getTheme().imgSrc;
					var cbd = new Object();
					// Button
					var bn = cbd.button = document.createElement("div");
					bn.className = cn.closeButton;
					bn.onmousedown = function(e){
						gfxt.sys("appl", id).getController().close(e);
					};
					// Icon
					var ic = cbd.icon = document.createElement("img");
					ic.className = cn.controlButtonImg;
					ic.src = is.closeButtonImg;
					ic.alt = "";
					bn.appendChild(ic);
					
					return cbd;
				},
				
				createMaximizeButton: function(){
					var id = ID;
					var cn = method.getTheme().className;
					var is = method.getTheme().imgSrc;
					var mabd = new Object();
					// Button
					var bn = mabd.button = document.createElement("div");
					bn.className = cn.maximizeButton;
					bn.onclick = function(e){
						gfxt.sys("appl", id).getController().maximize(e);
					};
					// Icon
					var ic = mabd.icon = document.createElement("img");
					ic.className = cn.controlButtonImg;
					ic.src = is.maximizeButtonImg;
					ic.alt = "";
					bn.appendChild(ic);
					
					return mabd;
				},
				
				createMinimizeButton: function(){
					var id = ID;
					var cn = method.getTheme().className;
					var is = method.getTheme().imgSrc;
					var mibd = new Object();
					// Button
					var bn = mibd.button = document.createElement("div");
					bn.className = cn.minimizeButton;
					bn.onclick = function(e){
						gfxt.sys("appl", id).getController().minimize(e);
					};
					// Icon
					var ic = mibd.icon = document.createElement("img");
					icclassName = cn.controlButtonImg;
					ic.src = is.minimizeButtonImg;
					ic.alt = "";
					bn.appendChild(ic);
					
					return mibd;
				},
				
				createFixButton: function(){
					var id = ID;
					var cn = method.getTheme().className;
					var is = method.getTheme().imgSrc;
					var fbd = new Object();
					// Button
					var bn = fbd.button = document.createElement("div");
					bn.className = cn.fixButton;
					bn.onclick = function(e){
						gfxt.sys("appl", id).getController().fix(e);
					};
					// Icon
					var ic = fbd.icon = document.createElement("img");
					ic.className = cn.controlButtonImg;
					ic.src = is.fixButtonImg;
					ic.alt = "";
					bn.appendChild(ic);
					
					return fbd;
				},
				
				createMenuItem: function(){
					var cn = method.getTheme().className;
					var mid = new Object();
					var mi = mid.menuItem = document.createElement("tr");
					mi.className = cn.menuItem;
					var i = mid.icon = document.createElement("td");
					i.className = cn.menuItemIcon;
					mi.appendChild(i);
					var la = mid.label = document.createElement("td");
					la.className = cn.menuItemLabel;
					mi.appendChild(la);
					
					return mid;
				},
				
				createMenu: function(){
					var cn = method.getTheme().className;
					var me = document.createElement("table");
					me.className = cn.menu;
					me.cellPadding = 0;
					me.cellSpacing = 0;
					return me;
				},
				
				setLayer: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					var count, setCount, limit, saveActive, base;
					var windowLayer = $$.windowLayer;
					for(count = 0 ; windowLayer[count] != null ; count++){
						if (windowLayer[count] == ID && count == 0) 
							return;
						else 
							if (windowLayer[count] == ID) {
								saveActive = windowLayer[count];
								setCount = count;
								break;
							}
					}
		
					for( ; setCount - 1 >= 0 ; setCount--){
						$$.windowLayer[setCount] = windowLayer[setCount - 1];
					}
					windowLayer[0] = saveActive;
					count = windowLayer.length;
					for(setCount = 0 ; setCount < windowLayer.length ; setCount++, count--){
						base = gfxt.sys("appl", windowLayer[count - 1]).getParts().base;
						base.style.zIndex = setCount + $$.defaultZIndex;
					}
				},
				
				addLayer: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					$$.windowLayer.push(ID);
				},
				
				deleteLayer: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					method.getController().activate();
					$$.windowLayer.shift();
				},
				
				testId: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					var id = ID;
					if(typeof id != "string")
						return false;
		
					var r = false;
					if($$.registry[id])
						r = true;
					return r;
				},
				
				deleteRegister: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					delete $$.registry[ID];
				},
				
				getActiveWindowId: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.activeWindow;
				},
				
				getData: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID];
				},
				
				getSource: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].source;
				},
				
				getTheme: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].theme;
				},
				
				getParts: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].parts;
				},
				
				getBaseCreator: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].baseCreator;
				},
				
				getController: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					if( $$.registry[ID] )
						return $$.registry[ID].controller;
					else 
						return false;
				},
				
				getManager: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].manager;
				},
				
				getSetting: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].setting;
				},
				
				getSaved: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].saved;
				},
				
				getStatus: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					return $$.registry[ID].status;
				},
				
				increase: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					$$.windowLength++;
				},
				
				decrease: function(){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					$$.windowLength--;
				},
				
				register: function(data){
					var $$ = gfxt.sys().getAccessory("appl").$$;
					$$.registry[ID] = data;
				},
				
				createId: function(){
					return String((new Date()).getTime() + Math.round(Math.random() * 10000));
				}
			};
			return method;
		};
		return core;
	})();
	
	var applInfo = {
		name: "Applied Layer Package",
		version: "1.0",
		egg: function(a){if(a == "ready")alert("Sorry, Saneyuki Tadokoro is not still ready for eating eggs :(")}
	};
	
	gfxt.sys().addPackage("appl", applPackage, applInfo);
	
	gfxt.sys().getAccessory("appl").$$ = {
		// Window length
		windowLength: 0,
		// WIndow layer
		windowLayer: new Array(),
		// Active window id
		activeWindow: null,
		// Window registry
		registry: new Object(),
		defaultTitle: "Untitled",
		defaultMinWidth: 200,
		defaultMaxWidth: "unlimited",
		defaultMinHeight: 145,
		defaultMaxHeight: "unlimited",
		defaultMinTop: "unlimited",
		defaultMaxTop: "unlimited",
		defaultMinLeft: "unlimited",
		defaultMaxLeft: "unlimited",
		defaultWidth: gfxt.uAgent.clientWidth / 2,
		defaultHeight: gfxt.uAgent.clientHeight / 2,
		defaultTop: 0,
		defaultLeft: 0,
		defaultZIndex: 10,
		defaultTheme: {
			themeName: "Applied-Layer-Default-Theme",
			themeCss: "gfxt/client/applied-layer/css/window.css",
			className:{
				base: "appl-base",
				titleBar: "appl-title-bar",
				menuBar: "appl-menu-bar",
				menu: "appl-menu",
				menuButton: "appl-menu-button",
				menuItem: "appl-menu-item",
				menuItemIcon: "appl-menu-item-icon",
				menuItemLabel: "appl-menu-item-label",
				clientArea: "appl-client-area",
				title: "appl-title",
				icon: "appl-icon",
				closeButton: "appl-close-button",
				maximizeButton: "appl-maximize-button",
				minimizeButton: "appl-minimize-button",
				fixButton: "appl-fix-button",
				controlButtonImg: "appl-control-button-img",
				frame: "appl-frame",
				upperLeftFrame: "appl-frame-upper-left",
				upperFrame: "appl-frame-upper",
				upperRightFrame: "appl-frame-upper-right",
				leftFrame: "appl-frame-left",
				centerFrame: "appl-frame-center",
				rightFrame: "appl-frame-right",
				bottomLeftFrame: "appl-frame-bottom-left",
				bottomFrame: "appl-frame-bottom",
				bottomRightFrame: "appl-frame-bottom-right",
				upperLeftResizingPoint: "appl-resize-point-upper-left",
				upperResizingPoint: "appl-resize-point-upper",
				upperRightResizingPoint: "appl-resize-point-upper-right",
				leftResizingPoint: "appl-resize-point-left",
				rightResizingPoint: "appl-resize-point-right",
				bottomLeftResizingPoint: "appl-resize-point-bottom-left",
				bottomResizingPoint: "appl-resize-point-bottom",
				bottomRightResizingPoint: "appl-resize-point-bottom-right"
			},
			imgSrc:{
				defaultIcon: "packages/applied-layer/img/default.png",
				closeButtonImg: "packages/applied-layer/img/close.gif",
				disabledCloseButtonImg: "packages/applied-layer/img/disabled-close.gif",
				maximizeButtonImg: "packages/applied-layer/img/maximize.gif",
				disabledMaximizeButtonImg: "packages/applid-layer/img/disabled-maximize.gif",
				fixButtonImg: "packages/applied-layer/img/fix.gif",
				disabledFixButtonImg: "packages/applied-layer/img/disabled-fix.gif",
				restoreButtonImg: "packages/applied-layer/img/restore.gif",
				unfixButtonImg: "packages/applied-layer/img/unfix.gif",
				minimizeButtonImg: "packages/applied-layer/img/minimize.gif",
				disabledMinimizeButtonImg: "packages/applied-layer/img/disabled-minimize.gif"
			}
		}
	};
	
	gfxt.appliedLayer = appliedLayer;
})
(gfxt);	// EXECUTE
