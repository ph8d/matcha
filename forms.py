
# Validators

class Length(object):
	def __init__(self, min=-1, max=-1, message=None):
		self.min = min
		self.max = max
		if not message:
			message = u'Field must be between %i and %i characters long.' % (min, max)
		self.message = message
	
	def __call__(self, form, field):
		l = field.data and len(field.data) or 0
		if l < self.min or self.max != -1 and l > self.max:
			field.error = self.message
			return False
		return True

class DataRequired(object):
	def __init__(self, message=None):
		if not message:
			message = u'This field is required'
		self.message = message

	def __call__(self, form, field):
		data = field.data
		if data:
			return True
		field.error = self.message
		return False



# Forms

class FormField:

	def __init__(self, name):
		self.name = name
		self.data = None
		self.error = None



# Testing

validators = [DataRequired(), Length(4, 20)]


class Field(object):
	def __init__(self):
		self.data = "1234"
		self.error = None

field = FormField("Login")
field.data = ""

for validator in validators:
	if not (validator(1, field)):
		print(field.error)
		break
