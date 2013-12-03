import re, os, fileinput
import os, urllib2
     
class ReplaceJS:
	def __init__(self):
		self.ADAPTERS = "./adapter/"
		self.PATH = "./js-lib/"
		self.FILE_MATCHES = re.compile("\.(js|json|html)$")
		self.JS_FILE = "scripts/js_list.txt"
		self.JS_LIB = "/js-lib/"
		self.OKAY_URLS = []
	
	def check_list():
	    isChecked = False
	    fileinput.close()
	    
	    for line in fileinput.input(JS_FILE, inplace=False):
	        line = line.rstrip('\n')
	        if(line == "done"):
	            isChecked = True
	        else:
	            if not isChecked:
	                return False
	
	            line = line.split(", ")
	            OKAY_URLS.append(tuple(line))
	
	    return isChecked
	 
	# Return a list with paths to files worth scanning
	def get_files(path):
	    files = []
	     
	    for f in os.listdir(path):
	        if os.path.isdir(path + f):
	            files += get_files(path + f + "/")
	     
	        # if file_match w/ regex, add file to the list
	        match = FILE_MATCHES.search(path + f)
	        files.append(path + f) if (match) else None
	        
	    # Return the lists
	    return files
	     
	# See if a needs to change an URL
	def replace_src(filename, expr, target):
	    # Rewrite all lines in the file
	    for line in fileinput.input(filename, inplace=True):
	    # Print/replace all lines that match
	        if expr in line:
	            line = re.sub(target, JS_LIB + expr, line)
	            
	        print line,
	
	# Replace OKAY_URLs with local urls
	def replace_urls(filename):
	    [replace_src(filename, expr, target) for expr,target in OKAY_URLS]
	     
	def read_js_file():
	    if not os.path.exists(PATH):
	        os.makedirs(PATH)
	    
	    with open(JS_FILE) as jsfile:
	        lines = jsfile.readlines()
	
	    for line in lines:
	        line = line.rstrip('\n')
	        if not line == "done":
	            line = line.split(", ")
	            url = line[1]
	            filename = line[0]
	        
	            response = urllib2.urlopen(url)
	            content_js = response.read()
	        
	            with open(PATH + filename, 'w') as f:
	                f.write(content_js)
	
# Execute if run as a script
if __name__ == '__main__':
    if check_list():
        # For all files, replace the urls
        [replace_urls(x) for x in get_files(ADAPTERS)] 
    else:
        print "List file not checked and marked with \"done\" in head."
