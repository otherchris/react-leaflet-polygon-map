const displayArea = (area, unit) => (unit === 'miles' ? area / 2590000 : area);

export const tooltipMessage = (polyProps, tooltipOptions = {}) => {
  if (tooltipOptions.tipMessage) return tooltipOptions.tipMessage;
  const area = displayArea(polyProps.area, polyProps.unit) || 0;
  if (tooltipOptions.text && tooltipOptions.includeArea) {
    const unitName = tooltipOptions.units.name ? `Sq ${tooltipOptions.units.name}` : 'Sq Meters';
    const areaWithUnit = `${area} ${unitName}`;
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${areaWithUnit}`;
    return tipMessage;
  }
  if (tooltipOptions.text && tooltipOptions.includeArea && !tooltipOptions.units) {
    const text = tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = `${text} ${area.toFixed(4)} Sq Meters`;
    return tipMessage;
  }
  if (tooltipOptions.text && !(tooltipOptions.includeArea)) {
    const text = tooltipOptions && tooltipOptions.text ? tooltipOptions.text : '';
    const tipMessage = text;
    return tipMessage;
  }
  const tipMessage = `${area.toFixed(4)} Sq ${polyProps.unit}`;
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
