var canvas = document.getElementById("Canvas")
console.log(canvas)
var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect()

var highlight = "none"

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight - 140;

var Background = new Image()
Background.src = "/static/Icons/Background.png"

Pin.forEach((Icons) => {
    console.log(Icons)
    if (Icons.hasOwnProperty("src"))
        Icons.Update()
})

window.onload = function() {

    trackTransforms(ctx);

    function redraw() {
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.drawImage(Background, 0, 0)

        Pin.forEach((Icons) => {
            if (Icons.hasOwnProperty("src")) {
                Icons.Update()
            }
        })
    }
    redraw();

    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;

    var dragStart, dragged;

    canvas.addEventListener('mousedown', function(evt) {
        Pin.forEach((Icons) => {
            Icons.fill = "black"
        })
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;

        console.log(Pin[1].x)

    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);

    document.getElementById("toiletMenu").addEventListener('click', function() {
        Pin.forEach((Icons) => {
            console.log(Icons)
            if (Icons['type'] == "toilet") {
                console.log(Icons["type"])
                Icons.fill = "red"
            }
        })
        redraw()
    })

    document.getElementById("infoMenu").addEventListener('click', function() {
        Pin.forEach((Icons) => {
            console.log(Icons)
            if (Icons['type'] == "info") {
                console.log(Icons["type"])
                Icons.fill = "red"
            }
        })
        redraw()
    })

    canvas.addEventListener('mouseup', function(evt) {
        dragStart = null;
        // if (!dragged) zoom(evt.shiftKey ? -1 : 1);

    }, false);

    var scaleFactor = 1.1;

    var zoom = function(clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw();
    }

    document.getElementById("ZoomIn").addEventListener("click", (event) => {
        zoom(event ? 1 : -1)
    })
    document.getElementById("ZoomOut").addEventListener("click", (event) => {
        zoom(event ? -1 : 1)
    })
};

function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function() { return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function() {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function() {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}

function CheckCollition(X, Y, rect2) {
    if (X < rect2.x + rect2.width / 2 &&
        X > rect2.x - rect2.width / 2 &&
        Y < rect2.y + rect2.height / 2 &&
        Y > rect2.y - rect2.height / 2) {
        current_booth = rect2;
        return true;
    } else {
        return false;
    }
}

//referecne https://codepen.io/techslides/details/zowLd