var dwl_Default = {
    'icons' : {
        'dwl' : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z',
        'valid' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNCqoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh546EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWANyRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfDaAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC',
        'warning' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAA3NCSVQICAjb4U/gAAAAb1BMVEX////m4t7/69bm4t7MzMz/5c3mz77jx7T/z6rksZX/tYf7o3XomXf/mWb/fFDwflr/dD7/bUT/zlj/xJr/w1X/slD7o3X/pEz/oEv/kkf/jEX/f0L/fFD/dD72cEv/bUT+az36aEL6ZEH9YzyZAAAajZ7FAAAAJXRSTlMAESIiIjNERFVmd4iImaqqu7v/////////////////////////86oppAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDgvMTMvMTAb/B4YAAAAd0lEQVQImVXN2xKCMAxF0aiogPdDA7QYjcr/f6O05VLOU/eazJQorqpotZNInfZWjdFDAtcWaF9L54K+hxQzPNgDfzdjlw4e4M4jKEfg3y70xSIC7M33Xs0ERo8DPBvMa4av8y48wwXQFfTmFPhDitWU6G7dMsn+EKkNYAgqGr0AAAAASUVORK5CYII=',
        'http' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAA3NCSVQICAjb4U/gAAABX1BMVEX///8AGW4AACQAM5kNHSEBFiIAQqZDfL8mSFkaP1YfPVUILFNdiMUkS2EARZwLPnQDNX6QrdNmmcxakMoja7oNWqYFPYgALXNmmcwjaa4NWqYfUH0FU6MCOnmbt9t6otGMrd55pNRDe6QzZpkncry2zOVnos270emUud9nos1dl8lDkdX////2+fzm+v/g+f/t9Pnm7vbO8v7g7Pbc5/TV6fjX4/HH5/zM4/W16f+/5f7O3/Cs5f/A4PfJ3PDA3fO13v/D2e271u+n3Piw2PW80+qW2/+10+2l1veU2f+00e2s0e+M1v+S0/ulzfGoyuqrx+WC0P+dyO6jxuZ/zv6VwuiKxfCExfCZwOiMwex2w/ZvxPmKu+SUud+Pt+NxvvRnvfWCtt9qufF/st5+suaMrd5jtfdjs+yArN1usORlr+Zarupsp9xspdlUp+RKltZPkshClN5Jkc86hsw9hMP8Ns4QAAAAdXRSTlMAEREiIiIzRERERERVVVVVVWZmZmZmZmZ3d3d3d3eIiLu7u7vM3d3u7u7u7v////////////////////////////////////////////////////////////////////////////////////////////////+XEIMzAAAACXBIWXMAAABkAAAAZAF4kfVLAAAAJXRFWHRTb2Z0d2FyZQBNYWNyb21lZGlhIEZpcmV3b3JrcyBNWCAyMDA0h3aszwAAAMlJREFUeJxjYAABNmEJETYGGOBRUHd1DNBQZIdw5Qx1zByt7awNzORBXEFdXbtgdycvEzNrMyEGBmY164BgP29vex0dXV1VRgbR3JhgEwu/IH87Qx2dWD4GyfzMSKCUX1yGv45hkRSDZGFetreOaVhqSoSOY44Mg1h+epqVcZinb2BUaJa2AAOTSny0i4eNpY1bSEKSChMDg3ixj6+zkb6Rg2dgET/IAbIl4R62euZ+4QXSEAdyK2slxyRqKnHBfcDKycvBwoANAACQeyY78zgQlwAAAABJRU5ErkJggg==',
        'file' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMZJREFUeNpi/P//PwMlgAWXRFdXFz6Tg8vKytbhNACm2cPDg0FPTw+b/FogxQhiM2HTDNIIA9+/f2f4+vUrw+fPnxk+fPiAYRgTNs1AW7fAxP7+/YuCcYYBzNk7duwAYR9paemXQK44SNO/f/8YYDTeQER2OkizgoICw58/f+CaCRoACjCQX2GKf//+jaIZrxeQ/YysAZ1NtAG4DCLKAFyaiTIAFGi4NJPtBZINwKYZlOmIMgAU9+TmRj9gatxEpD4/GAMgwAAmB/m2aUdLLwAAAABJRU5ErkJggg==',
        'folder' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAA3NCSVQICAjb4U/gAAAAPFBMVEX////W1tb29vbf39/Fki3//////5n/95H/9I7/64X/4Hvf39/W1tb/1G//zGbms07Fki2Hh4dsbGxLS0vxznl1AAAAFHRSTlMAESIiu////////////////////w6FHE8AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAAFnRFWHRDcmVhdGlvbiBUaW1lADA4LzEyLzEwo0B5fQAAAF9JREFUCJlNzlkOgCAMRdEik0XAB+5/r1LCdP64aUqJyADQtME2UOttrGssjOgD/ha2zxUJzDi0EPqSjmUGCW7KDpWQ4fzwzsDDCmFYIQ2QoM9P8bVLVKlbiXJs3J7rB0k/CJOj2tYHAAAAAElFTkSuQmCC'
    },
    init: function () {
      var _this = this;
      return _this;
    }
}

var dwl_Popup = {
    'dwlBk':{},
    'popup':null,
    'page':null,
    'g':null,
    'html' : '',
    init: function () {
      var _this = this;
      return _this;
    }
};
