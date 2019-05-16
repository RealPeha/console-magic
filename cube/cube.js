//Source: http://frankpoth.info/content/pop-vlog/javascript/2018/013-cube/cube.html

const Point2D = function(x, y) { this.x = x; this.y = y; };

      const Point3D = function(x, y, z) { this.x = x; this.y = y; this.z = z; };

      const Cube = function(x, y, z, size) {

        Point3D.call(this, x, y, z);

        size *= 0.5;

        this.vertices = [new Point3D(x - size, y - size, z - size),
                         new Point3D(x + size, y - size, z - size),
                         new Point3D(x + size, y + size, z - size),
                         new Point3D(x - size, y + size, z - size),
                         new Point3D(x - size, y - size, z + size),
                         new Point3D(x + size, y - size, z + size),
                         new Point3D(x + size, y + size, z + size),
                         new Point3D(x - size, y + size, z + size)];

        this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2], [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]];

      };

      Cube.prototype = {

        rotateX:function(radian) {

          var cosine = Math.cos(radian);
          var sine   = Math.sin(radian);

          for (let index = this.vertices.length - 1; index > -1; -- index) {

            let p = this.vertices[index];

            let y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
            let z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

            p.y = y + this.y;
            p.z = z + this.z;

          }

        },

        rotateY:function(radian) {

          var cosine = Math.cos(radian);
          var sine   = Math.sin(radian);

          for (let index = this.vertices.length - 1; index > -1; -- index) {

            let p = this.vertices[index];

            let x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
            let z = (p.z - this.z) * cosine - (p.x - this.x) * sine;

            p.x = x + this.x;
            p.z = z + this.z;

          }

        }

      };
      var height = 50;
      var width = 50;
      canvas.width = 50;
      canvas.height = 50;
      var context = canvas.getContext("2d");
      var pointer = new Point2D(0, 0);
      var cube = new Cube(0, 0, 40, 20);

      function project(points3d, width, height) {

        var points2d = new Array(points3d.length);

        var focal_length = 20;

        for (let index = points3d.length - 1; index > -1; -- index) {

          let p = points3d[index];

          let x = p.x * (focal_length / p.z) + width * 0.5;
          let y = p.y * (focal_length / p.z) + height * 0.5;

          points2d[index] = new Point2D(x, y);

        }

        return points2d;

      }

      function loop() {

        //window.requestAnimationFrame(loop);

        //height = 30;
        //width = 30;

        //context.canvas.height = height;
        //context.canvas.width  = width;

        context.fillStyle = "⬜";
        context.fillRect(0, 0, width, height);

        //context.strokeStyle = "#ffffff";

        cube.rotateX(pointer.y * 0.0001);
        cube.rotateY(-pointer.x * 0.0001);

        context.fillStyle = "⬛";

        var vertices = project(cube.vertices, width, height);

        for (let index = cube.faces.length - 1; index > -1; -- index) {

          let face = cube.faces[index];

          let p1 = cube.vertices[face[0]];
          let p2 = cube.vertices[face[1]];
          let p3 = cube.vertices[face[2]];

          let v1 = new Point3D(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
          let v2 = new Point3D(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);

          let n  = new Point3D(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);

          if (-p1.x * n.x + -p1.y * n.y + -p1.z * n.z <= 0) {

            context.beginPath();
            context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
            context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
            context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
            context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
            context.closePath();
            //context.fill();
            context.stroke();

          }


        }

      }

      //loop();

      window.addEventListener("click", (event) => {

        pointer.x = event.pageX - width * 0.5;
        pointer.y = event.pageY - height * 0.5;

      });
      setInterval(loop, 1000/5)