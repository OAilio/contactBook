const capitalizeName = (name) => {
  const nameParts = name.split(' ');
  
  const capitalizedParts = nameParts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  
  return capitalizedParts.join(' ');
};

// eslint-disable-next-line import/no-anonymous-default-export
export default{
  capitalizeName
}