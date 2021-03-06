//Reference: Stackoverflow, TowardDataScience, Reddit Forum
const MPos = [{
    x: 0,
    y: 0,
}]

var mode = 0

let route = false;

const BackgroundUser = []
const BoothIcons = []
const ToiletIcons = []
const Infos = []
const lines = []

var arr_object = []

function animate() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height)
    if (BackgroundUser.length > 0) {
        BackgroundUser[BackgroundUser.length - 1].Draw()
    }
    requestAnimationFrame(animate)
    var OldX;
    var OldY;
    arr_object.forEach((BoothIcon, index) => {
        if (BoothIcon.hasOwnProperty("type")) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.moveTo(OldX, OldY);
            ctx.lineTo(BoothIcon.x, BoothIcon.y);
            ctx.strokeStyle = '#FF0000'
            ctx.stroke();
            OldX = BoothIcon.x;
            OldY = BoothIcon.y;
        } else {
            //console.log(arr_object);
            BoothIcon.Update()
        }
        /*if (CheckCollitionImg(BoothIcon, Eraser) == true) {
            BoothIcons.splice(BoothIcon, 1)
        }*/
    });
      
} // .End animate

function startRoute(e) {
    route = true;
    draw(e);
}

function endRoute() {
    route = false;
    ctx.beginPath();
}

function draw(e) {
    if (!route) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
}

var ConX = 0
var ConY = 0
var On = 0
var EditIndex = 0

document.getElementById("Canvas").addEventListener("click", (event) => {
    event.preventDefault()
    var border = document.getElementById("Canvas").getBoundingClientRect();
    MPos.x = event.clientX - border.left - 25
    MPos.y = event.clientY - border.top - 25
    mode = 7
    console.log(MPos.x, MPos.y)
    if (mode == 7) {

        arr_object.forEach((A, index) => {
            if (CheckCollition(MPos.x, MPos.y, A) == true) {
                //BoothIcons.splice(index, 1)
                //OpenEdit(arr_object[index])
                document.getElementById("info").style = "display: block";
                EditIndex = index

                qr.set({
                    foreground: 'black', //  setup background color of qr code.
                    size: 100, // size image qr code
                    value: arr_object[index].title + "," + arr_object[index].dis + "," + arr_object[index].x + "," + arr_object[index].y // set text for qr
                });

            }
        });
    }

    if (mode == 4) {
        arr_object.forEach((A, index) => {
            if (CheckCollition(MPos.x, MPos.y, A) == true) {
                arr_object.splice(index, 1)
            }
        });

        arr_object.forEach((A, index) => {
            if (CheckCollition(MPos.x, MPos.y, A) == true) {
                OpenEdit(arr_object[index])
                EditIndex = index

                qr2.set({
                    foreground: 'black', //  setup background color of qr code.
                    size: 100, // size image qr code
                    value: arr_object[index].title // set text for qr
                });
            }
        });
        arr_object.forEach((B, index) => {
            if (CheckCollition(MPos.x, MPos.y, B) == true) {
                arr_object.splice(index, 1)
            }
        });
        arr_object.forEach((B, index) => {
            if (CheckCollition(MPos.x, MPos.y, B) == true) {
                arr_object.splice(index, 1)
            }
        });
    }

    if (MPos.y < Canvas.height && MPos.x < Canvas.width) {
        On = 1
        if (mode == 1) {
            ConX = event.clientX - border.left - 25
            ConY = event.clientY - border.top - 25
            var index = 1
            ShowMyForm(arr_object, index)
        }

        if (mode == 2) {
            // object.toilet.push(new BoothIcon(MPos.x, MPos.y, 50, 50, "/static/Icons/toilet.png", "Toilet"))
            arr_object.push(new BoothIcon(MPos.x, MPos.y, 50, 50, "/static/Icons/toilet.png", "Toilet"))
            //console.log(arr_object);
        }

        if (mode == 3) {
            arr_object.push(new BoothIcon(MPos.x, MPos.y, 50, 50, "/static/Icons/info.png", "Info"))
            //console.log(arr_object);
        }

        if (mode == 5) {
            arr_object.push({ x: MPos.x, y: MPos.y, "type": 'line' });
            //console.log(arr_object);
            //console.log(arr_object[0].type)
        }

    }
})

function initObject(arr) {
    new_arr = []
    arr.forEach(elem => {
        if (elem['type'] != 'line') {
            new_arr.push(new BoothIcon(elem.x, elem.y, elem.width, elem.height, elem.src, elem.title))
        } else {
            new_arr.push(elem)
        }

    })
    return new_arr

}

animate()