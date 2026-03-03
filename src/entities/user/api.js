const BASE_URL = "https://dummyjson.com/users";

export async function fetchUsers({
  limit = 10,
  skip = 0,
  sortBy,
  order,
} = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
  }

  if (order) {
    params.append("order", order);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки пользователей: ${response.status}`);
  }

  return response.json();
}