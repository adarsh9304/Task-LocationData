export const parseArrayParam = (param: string): number[] => {
    if (typeof param === 'string') {
      try {
        const parsedArray = JSON.parse(param);
        if (Array.isArray(parsedArray)) {
          return parsedArray.map(ele => Number(ele));
        }
      } catch (e) {
        return [];
      }
    }
    return [];
  };