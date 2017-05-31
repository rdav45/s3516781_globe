/*
    Copyright (c) 2011, Nirav Patel <http://eclecti.cc>
    Code for mount was modified from original provided by Nirav Patel to suit the globe, lens and projector used on project
    
    The original code can be found here: https://github.com/nrpatel/SnowGlobe/tree/master/hardware 

    Permission to use, copy, modify, and/or distribute this source code for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

    THE SOURCE CODE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOURCE CODE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOURCE CODE.
*/

opteka_r1 = 37.6/2; //groove on top of lens mount
opteka_r2 = 41.66/2; //depth of lens mount= diameter of lens top

module rounded(size, r) {
    union() {
        translate([r, 0, 0]) cube([size[0]-2*r, size[1], size[2]]);
        translate([0, r, 0]) cube([size[0], size[1]-2*r, size[2]]);
        translate([r, r, 0]) cylinder(h=size[2], r=r);
        translate([size[0]-r, r, 0]) cylinder(h=size[2], r=r);
        translate([r, size[1]-r, 0]) cylinder(h=size[2], r=r);
        translate([size[0]-r, size[1]-r, 0]) cylinder(h=size[2], r=r);
    }
}

module opteka() {
    union() {
        cylinder(r=29.14/2, h=7);//inside diameter small part of bottom of lens
        translate([0, 0, 3]) cylinder(r=opteka_r1, h=2.5);
        cylinder(r=25.26/2, h=10); //hole size of lens mount
        translate([0, 0, 10]) cylinder(r1=25/2, r2=opteka_r2, h=3);
        translate([0, 0, 13]) cylinder(r=opteka_r2, h=8.42);
    }
}

margin = 0.1;
angle = -7; //projector angle to center projection image through fish-eye lens
wall = 5; // globe mount thickness
wall2 = 3; //projector bracket thickness
image_h = 10; 

//projector dimensions
sony_offset = 22; //offset of projector lens
sony_w = 77; //projector width, bracket distance
sony_wb = 69.75; //outside edge of projector bracket
sony_wb2 = 49.75; //inside edge of projector bracket
sony_l1 = 170; //length 1
sony_l2 = 100; //length 2

globe_r1 = 80/2; //globe opening radius
globe_r2 = 80/2; // bottom of globe radius for mount
globe_h = 10; //size of globe mount holes
globe_bolt = 3.5/2;

module lens_mount() difference() {
    translate([0, 0, -2]) union() {
        translate([0, 0, opteka_r2]) rotate([angle, 0, 0]) difference() {
            union() {
                difference() {
                   //position of globe mount base
                    translate([-globe_r2-4*wall, -12, -opteka_r2-wall]) cube([2*(globe_r2+4*wall), 2*wall, 4*wall]);
                    translate([-globe_r2-2*wall, -12, -opteka_r2+wall]) rotate([-90, 0, 0]) cylinder(r=globe_bolt, h=20);
                    translate([globe_r2+2*wall, -12, -opteka_r2+wall]) rotate([-90, 0, 0]) cylinder(r=globe_bolt, h=20);
                }
                //globe mount angles
                for(t = [-45, -135]) {
                    rotate([0, t, 0]) translate([0, -12, -2*wall]) difference() {
                        cube([globe_r2+4*wall, 2*wall, 4*wall]);
                        translate([globe_r2+2*wall, 0, 2*wall]) rotate([-90, 0, 0]) cylinder(r=globe_bolt, h=globe_h);
                    }
                }
                translate([-opteka_r1-wall, -12, -opteka_r2-wall]) union() {
                    cube([2*(opteka_r1+wall), 12, (opteka_r2+wall+opteka_r1)]);
                    rounded([2*(opteka_r1+wall), 2*(opteka_r1+wall), 17], 10);
                }
            }
            minkowski() {
                rotate([90, 0, 0]) opteka();
                translate([-margin, -margin, -margin]) cube([margin*2, margin*2, 50+margin]);
            }
        }
        
        
        translate([-sony_offset, 0, 0]) difference() {
            union() {
                translate([-sony_wb/2, 0, 0]) rounded([sony_wb, sony_l1, opteka_r2-image_h], 10);
                translate([-sony_wb2/2, 0, 0]) rounded([sony_wb2, sony_l2, opteka_r2-image_h], 20);
                
                //bracket points for projector
                for(y = [10, 80]) {
                    union() {
                        translate([-sony_w/2-wall2, y, 0]) cube([wall2, 10, 20]);
                        translate([sony_w/2, y, 0]) cube([wall2, 10, 20]);
                        translate([-sony_w/2, y, 0]) cube([sony_w, 10, opteka_r2-image_h]);
                    }
                }
            }
            translate([-sony_wb2/2+wall, wall, 0]) rounded([sony_wb2-2*wall, sony_l2-2*wall, 50], 10);
        }
    }
    
    translate([-200, -200, -100]) cube([400, 400, 100]);
}

module globe_mount() {
    difference() {
        union() {
            cylinder(r1=globe_r2+wall, r2=globe_r1+wall, h=globe_h);
            translate([-globe_r2-4*wall, -opteka_r2-wall, 0]) difference() {
                rounded([2*(globe_r2+4*wall), 4*wall, wall],2);
                translate([2*wall, 2*wall, 0]) cylinder(r=globe_bolt, h=globe_h);
                translate([2*globe_r2+6*wall, 2*wall, 0]) cylinder(r=globe_bolt, h=globe_h);
            }
            for(t = [45, 135]) {
                rotate([0, 0, t]) translate([0, -2*wall, 0]) difference() {
                    rounded([globe_r2+4*wall, 4*wall, wall], 2);
                    translate([globe_r2+2*wall, 2*wall, 0]) cylinder(r=globe_bolt, h=globe_h);
                }
            }
            for(i = [0:11]) {
                rotate([0, 0, i*360/12]) translate([-globe_r2-wall, -wall, 0]) cube([20, 2*wall, globe_h/2+wall]);
            }
        }
        cylinder(r1=globe_r2, r2=globe_r1, h=globe_h-wall);
        cylinder(r=globe_r1, h=globe_h+1);
        translate([-wall, -globe_r2-2*wall, 0]) cube([2*wall, 2*(globe_r2+2*wall), globe_h+1]);
        for(i = [0:11]) {
            rotate([0, 0, i*360/12]) translate([-globe_r2-wall, 0, globe_h/2]) rotate([0, 90, 0]) cylinder(r=globe_bolt, h=20);
        }
    }
}

//lens_mount();

globe_mount();
