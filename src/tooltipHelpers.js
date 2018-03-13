export const tooltipMessage = (polyProps) => {
  const { area } = polyProps;
  if (area) return `${area.toFixed(4)} sq miles`;
  return '';
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
