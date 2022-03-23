def compare_lists(*args):
	for i in range(len(args)):
		args[i].sort()
	for i in range(len(args) - 1):
		if args[i] != args[i + 1]:
			return False

	return True

a = ["1", "2", "3"]
b = ['2', "1", "3"]
c = ['3', 'a', '2']

print(compare_lists(a, b, c))