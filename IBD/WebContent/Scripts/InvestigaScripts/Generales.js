function vaciarArreglo(arreglo) {
	if (!(arreglo.pop))
		return;

	while (arreglo.length > 0) {
		arreglo.pop();
	}
}

Array.prototype.copyFrom = function (origen) {
	vaciarArreglo(this);
	for (var i = 0; i < origen.length; i++) {
		if (typeof (origen[i]) == "object") {
			var nuevo = {};
			$.extend(true, nuevo, origen[i]);
			this.push(nuevo);
		}
		else {
			this.push(origen[i]);
		}
	}
}

function functionError(errorCode) {
	switch (errorCode) {
		case 401:
			window.location.replace("/Account/Logon?ReturnUrl=/Asistente_ImportacionModelo");
			break;
		default:
			console.log("Error: " + errorCode)
	}
}

