require 'sinatra'
require 'erb'

get '/' do
	erb :index
end

run Sinatra::Application