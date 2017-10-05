export const tooltipMessage = (polyProps, tooltipOptions) => {
  const area = polyProps.area || 0;
  if (tooltipOptions && tooltipOptions.includeArea) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const convertedArea = tooltipOptions.units.conversion ?
      polyProps.area * tooltipOptions.units.conversion :
      polyProps.area;
    const areaWithUnit = `${convertedArea.toFixed(4)} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions && tooltipOptions.includeArea && !tooltipOptions.units) {
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${area.toFixed(4)} Sq Meters`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = `${area.toFixed(4)} Sq Meters`;
  return tipMessage;
};

export const circleTooltip = (circleProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.includeArea && tooltipOptions.units) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const convertedArea = tooltipOptions.units.conversion ?
      circleProps.area * tooltipOptions.units.conversion : circleProps.area;
    const areaWithUnit = `${convertedArea.toFixed(4)} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions && tooltipOptions.includeArea && !tooltipOptions.units) {
    const area = circleProps.area;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${area.toFixed(4)} Sq Meters`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = `${circleProps.area.toFixed(4)} Sq Meters`;
  return tipMessage;
};

export const rectTooltip = (rectProps, tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.includeArea) {
    const noArea = 'Area cannot be calculated on rectangle';
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${noArea}`;
    return tipMessage;
  }
  if (tooltipOptions && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = 'Area cannot be calculated on rectangle';
  return tipMessage;
};

export const pointsTooltip = (point, tooltipOptions) => {
  const coords = point.geometry.coordinates;
  if (tooltipOptions && tooltipOptions.marker && tooltipOptions.marker.includeLocation) {
    const latLng = `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${latLng} ${text}`;
    return tipOpts;
  }
  if (tooltipOptions && tooltipOptions.marker && !(tooltipOptions.marker.includeLocation)) {
    const text = tooltipOptions.marker.text ? tooltipOptions.marker.text : '';
    const tipOpts = `${text}`;
    return tipOpts;
  }
  const latLng = `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
  return latLng;
};

export const tooltipClass = (tooltipOptions) => {
  if (tooltipOptions && tooltipOptions.className) {
    const tipClass = tooltipOptions.className ? `${tooltipOptions.className}` : '';
    return tipClass;
  }
  return 'tooltipClass';
};
